import * as fs from "fs";

export const parseCliParams = (args: string[]): cliParams => {
  const argsSplit = args
    .slice(2)
    .join("")
    .split(/-/)
    .filter((a) => /.+/.test(a));
  //console.log(args)
  let [ddelete, split, executable, cfgFunctions, join, pathIn, pathOut] = [
    false,
    false,
    false,
    false,
    false,
    ".",
    "./compiled",
  ];
 
  argsSplit.forEach((a) => {
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
      case /^in/.test(a.slice(0, 2)):
        pathIn = a.replace(/^in */, "");
        //console.log("directory:"+pathIn)
        break;
      case /^out/.test(a.slice(0, 3)):
        pathOut = a.replace(/^out */, "");
        //console.log("directory out:"+pathOut)
        break;
      default:
        console.log("could not parse argument:'" + a + "'");
    }
  });
  return {
    ddelete: ddelete,
    split: split,
    executable: executable,
    cfgFunctions: cfgFunctions,
    join: join,
    pathIn: pathIn,
    pathOut: pathOut,
  };
};

export type cliParams = {
  split: boolean;
  executable: boolean;
  cfgFunctions: boolean;
  pathIn: string;
  pathOut: string;
  ddelete: boolean;
  join: boolean;
};

export type validContainer = { valid: boolean; errors: string[] };
export const verifyParams = (glParams: cliParams): validContainer => {
  //console.log("verified:",split, executable, cfgFunctions, pathIn, pathOut);
  let valid = true;
  let errors: string[] = [];
  if (!glParams.split && !glParams.executable && !glParams.cfgFunctions) {
    valid = false;
    errors.push("no operation was selected.");
  }

  fs.stat(glParams.pathIn, (error, stats) => {
    if (error) {
      valid = false;
      errors.push("can not read in:", +"'" + glParams.pathIn + "'");
    } else {
      if (!stats.isFile && !stats.isDirectory) {
        valid = false;
        errors.push("in is not a file or directory:", glParams.pathIn);
      }
    }
  });
  return { valid: valid, errors: errors };
};
