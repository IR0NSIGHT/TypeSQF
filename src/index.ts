import { findAllSQFs, parseFunctionsFromSingleFiles } from "./parse/sqfParser";
import { compileFileInit } from "./compile/compileSqf";
import { writeInitFile } from "./CLI_Operations/writeInitFile";
import { performSplit } from "./CLI_Operations/splitBlob";
import { genCfgFunctions } from "./CLI_Operations/buildCfgFunctionsFile";
const helpString =
  "this program helps with preparing sqf functions.\r\n" +
  "flags:\r\n" +
  "\t-f\tcfgFunctions: will use split functions and prepare a .hpp file for use in cfgFunctions.\r\n" +
  "\t-e\texecutable: will prepare sqf code that loads all function files via execVM for easy reloading during developement.\r\n" +
  "\t-s\tsplit: will read in a blob file and split it into single-function-files for all global function declarations.\r\n" +
  "\t-j\tjoin: will produce a blob file from many single-function-files.\r\n" +
  "\t-in\tdirectory: input directory to use for operations\r\n" +
  "\t-out\tdirectory: out directory to use for operations\r\n";

import { parseCliParams, verifyParams } from "./cliParams";

const params = parseCliParams(process.argv);
const valid = verifyParams(params);

if (!valid.valid) {
  console.log("ERROR:", valid.errors.join("\r\n"));
  console.log(helpString);
} else {
  if (params.split) {
    console.log(
      "perform split on file ",
      params.pathIn,
      " towards dir ",
      params.pathOut,
      " with deletion:",
      params.ddelete
    );
    performSplit(params.pathIn, params.pathOut, params.ddelete);
  }

  if (params.cfgFunctions) {
    console.log(
      "generate cfgFunctions for ",
      params.pathIn,
      " in ",
      params.pathOut
    );
    genCfgFunctions(params.pathIn, params.pathOut, "description.ext");
  }

  if (params.executable) {
    const missionRoot = params.pathIn;
    //expects folder structure such as: . -> functions -> irn_fnc_owo.sqf
    const files = findAllSQFs(missionRoot + "/functions", true).filter(
      (f: string) => /fnc/.test(f)
    );
    const functions = parseFunctionsFromSingleFiles(files);
    //paths now relative to mission root for execVM
    functions.forEach((f) => {
      f.filePath =
        f.filePath?.replace(new RegExp("^" + missionRoot + "/"), "") ?? null;
    });

    const loadFncsCode = compileFileInit(functions);
    const initFile = writeInitFile(loadFncsCode, params.pathOut, "init.sqf");
    console.log("wrote init file: " + initFile);
  }
}
