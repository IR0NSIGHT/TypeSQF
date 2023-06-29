import * as fs from "fs";
import { completeFunctionRgx } from "../Regex/sqfRegex";
import { parseFunction } from "../parse/sqfParser";
import { sqfFunction, isSqfFunction } from "../sqfTypes";
import { saveSqfFunctionToExecutableFile } from "../compile/compileSqf";
const sliceToFunctions = (myString: string, rgx: RegExp) => {
  var fncRgx = new RegExp(rgx.source, "g");
  var functions = myString.match(fncRgx);
  return functions;
};

const warnDocstringDoesntExist = (fnc: sqfFunction) => {
  if (fnc.description === null)
    console.log(
      "WARNING: missing docstring at '" + fnc.globalName + "'",
      fnc.filePath
    );
};

const runtimeErr = (mssg: string, operation: string) => {
  console.log("ERROR: ", mssg, " during operation ", operation);
};

/**
 * read a blob file and split it into a working directory of single-file-functions
 * @param inPath
 * @param outDir
 * @param ddelete
 * @returns
 */
export const performSplit = (
  inPath: string,
  outDir: string,
  ddelete: boolean
) => {
  if (!fs.lstatSync(inPath).isFile()) {
    runtimeErr("input file is not a file:\t'" + inPath + "'\t.", "split");
    return "";
  }
  const allFileContents = fs.readFileSync(inPath, "utf-8");
  const functionBlobs = sliceToFunctions(allFileContents, completeFunctionRgx);
  if (functionBlobs === null) {
    console.log("nothing to do, abort");
    return "";
  }
  //complain about missing documentation
  if (ddelete) {
    console.log("overwrite input file after deletion:", inPath);
    const lenghtOrg = allFileContents.length;
    const code = allFileContents.replace(
      new RegExp(completeFunctionRgx.source, "g"),
      ""
    );
    const lengthNow = code.length;
    console.log("removed ", lenghtOrg - lengthNow, " characters.");
    fs.writeFile(inPath, code, (err) => {
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
    fnc.filePath = outDir + "/" + fnc.globalName + ".sqf";
  });
  parsedFncs.forEach(saveSqfFunctionToExecutableFile);
  return 1;
};
