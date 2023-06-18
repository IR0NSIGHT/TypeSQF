import * as fs from 'fs';
import { completeFunctionRgx} from "./Regex/sqfRegex";
import { isSqfFunction, sqfFunction } from "./sqfTypes";
import { parseFunction, parseFunctionsFromSingleFiles } from "./parse/sqfParser";
import { compileInitForFunctions, saveSqfFunction } from "./compile/compileSqf";
import { cfgFunctions } from "./compile/compileCfg";

const sliceToFunctions = (myString: string, rgx: RegExp) => {
  var fncRgx = new RegExp(rgx.source,"g");
  var functions = myString.match(fncRgx);
  return functions;
};

const warnDocstringDoesntExist = (fnc: sqfFunction) => {
  if (fnc.description === null)
    console.log("WARNING: missing docstring at '" + fnc.globalName+"'",fnc.filePath);
}

export const writeFile = (code: string, path: string) => {
  fs.writeFile(path, code, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  return path;
}

const writeInitFile = (code: string, dir: string, fileName: string) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = dir!="."?dir+"/"+fileName:fileName;
  return writeFile(code,filePath);
};

const parseGlobalParams = (args: string[]): globalParams => {
  const argsSplit = args.slice(2).join("").split(/-/).filter(a => /.+/.test(a));
  //console.log(args)
  let [ddelete, split, executable, cfgFunctions, join, pathIn, pathOut] = [false,false, false, false, false, ".", "./compiled"];
  argsSplit.forEach(a => {
    //console.log(a," =>")
    switch (true) {
      case /s$/.test(a[0]):
        split = true;
        //console.log("split")
        break;
      case /e$/.test(a[0]):
        //console.log("executeable")
        executable = true;
        break;
      case /f$/.test(a[0]):
        //console.log("cfgFunctions")
        cfgFunctions = true;
        break;
      case /d$/.test(a[0]):
        ddelete = true;
        break;
      case /j$/.test(a[0]):
          //console.log("cfgFunctions")
          join = true;
          break;
      case /^in/.test(a.slice(0,2)):
        pathIn = a.replace(/^in */,"");
        //console.log("directory:"+pathIn)
        break;
      case /^out/.test(a.slice(0,3)):
        pathOut = a.replace(/^out */,"");
        //console.log("directory out:"+pathOut)
        break;
      default:
        console.log("could not parse argument:'"+a+"'")
    }
  })
  return {ddelete: ddelete, split: split, executable: executable, cfgFunctions: cfgFunctions, join: join, pathIn: pathIn, pathOut: pathOut};
};

type globalParams = {split: boolean, executable: boolean, cfgFunctions: boolean, pathIn: string, pathOut: string, ddelete: boolean, join: boolean}

type validContainer = {valid: boolean, errors: string[]};
const verifyParams = (glParams: globalParams): validContainer => {
  //console.log("verified:",split, executable, cfgFunctions, pathIn, pathOut);
  let valid = true;
  let errors: string[] = [];
  if (!glParams.split && !glParams.executable && !glParams.cfgFunctions) {
    valid = false;
    errors.push("no operation was selected.")
  };

  fs.stat(glParams.pathIn, (error, stats) => {
      if (error) {
        valid = false;
        errors.push("can not read in:",+"'"+glParams.pathIn+"'");
      }
      else {
        if (!stats.isFile && !stats.isDirectory) {
          valid = false;
          errors.push("in is not a file or directory:",glParams.pathIn);
        };
      }});
  return {valid: valid, errors: errors}
};

const helpString = "this program helps with preparing sqf functions.\r\n"+
  "flags:\r\n"+
  "\t-f\tcfgFunctions: will use split functions and prepare a .hpp file for use in cfgFunctions.\r\n"+
  "\t-e\texecutable: will prepare sqf code that loads all function files via execVM for easy reloading during developement.\r\n" +
  "\t-s\tsplit: will read in a blob file and split it into single-function-files for all global function declarations.\r\n" +
  "\t-j\tjoin: will produce a blob file from many single-function-files.\r\n" + 
  "\t-in\tdirectory: input directory to use for operations\r\n" + 
  "\t-out\tdirectory: out directory to use for operations\r\n";

const runtimeErr = (mssg: string, operation: string) => {
  console.log("ERROR: ",mssg, " during operation ", operation);
}

const performSplit = (inPath: string, outDir: string, ddelete: boolean) => {
  if (!fs.lstatSync(inPath).isFile()) {
    runtimeErr("input file is not a file:\t'"+inPath+"'\t.","split")
    return "";
  };
  const allFileContents = fs.readFileSync(inPath, 'utf-8');
  const functionBlobs = sliceToFunctions(allFileContents, completeFunctionRgx);
  if (functionBlobs === null) {
    console.log("nothing to do, abort")
    return "";
  }
  //complain about missing documentation
  if (ddelete) {
    console.log("overwrite input file after deletion:",inPath)
    const lenghtOrg = allFileContents.length;
    const code = allFileContents.replace(new RegExp(completeFunctionRgx.source,"g"),"");
    const lengthNow = code.length;
    console.log("removed ",lenghtOrg-lengthNow," characters.");
    fs.writeFile(inPath, code, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  }

  //handle the extracted strings
  const parsedFncs = functionBlobs.map(parseFunction).filter(isSqfFunction);
  parsedFncs.forEach(warnDocstringDoesntExist);

  //fncs dont have filepath bc they originate from a blob file
  parsedFncs.forEach((fnc) => {
    fnc.filePath = outDir +"/"+fnc.globalName+".sqf";
  });
  parsedFncs.forEach(saveSqfFunction);
  return 1;
}

const findAllSQFs = (path: string, recurse: boolean): string[] => {
  //console.log("collect sqf in folder:",path);
  const objs = fs.readdirSync(path).map(file => path+"/"+file);
  const sqfs = objs.filter(obj => /.sqf$/.test(obj) && fs.statSync(obj).isFile());
  console.log(path, sqfs);
  if (recurse) {
    const subFolders = objs.filter(obj => fs.statSync(obj).isDirectory()).map(folder => {return{name: folder, path: (path+"/"+folder)}});
    const subSQF = subFolders.flatMap(f => findAllSQFs(f.path, true).map(sqf=>f.name+"/"+sqf));
    return sqfs.concat(subSQF);
  }
  return sqfs;
}

const genCfgFunctions = (inPath: string, outDir: string, fileName: string) => {
  const functions = parseFunctionsFromSingleFiles(findAllSQFs(inPath, true));
  const cfgString = cfgFunctions(functions)
  writeInitFile(cfgString, outDir, fileName);
}

//console.log(defaultDocString)
//console.log(getDocString(defaultDocString, myFunction));

const params = parseGlobalParams(process.argv);
const valid = verifyParams(params);

if (!valid.valid) {
  console.log("ERROR:",valid.errors.join("\r\n"))
  console.log(helpString)
} else {
  if (params.split) {
    console.log("perform split on file ",params.pathIn," towards dir ",params.pathOut, " with deletion:",params.ddelete);
    performSplit(params.pathIn, params.pathOut, params.ddelete);
  }

  if (params.cfgFunctions) {
    console.log("generate cfgFunctions for ",params.pathIn," in ",params.pathOut);
    genCfgFunctions(params.pathIn, params.pathOut, "description.ext");
  }

  if (params.executable) {
    const missionRoot = params.pathIn;
    //expects folder structure such as: . -> functions -> irn_fnc_owo.sqf
    const files = findAllSQFs(missionRoot+"/functions",true).filter((f: string) => /fnc/.test(f));
    const functions = parseFunctionsFromSingleFiles(files);
    //paths now relative to mission root for execVM
    functions.forEach(f => {f.filePath = f.filePath?.replace(new RegExp("^"+missionRoot+"\/"),"")??null})

    const loadFncsCode = compileInitForFunctions(functions);
    const initFile = writeInitFile(loadFncsCode, params.pathOut, "init.sqf");
    console.log("wrote init file: " + initFile);
  }
}

