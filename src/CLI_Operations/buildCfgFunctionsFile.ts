import { cfgFunctions } from "../compile/compileCfg";
import { saveSqfFunctionToCfgFile } from "../compile/compileSqf";
import { findAllsqfFiles, parseFunctionsFromSingleFiles } from "../parse/sqfParser";
import { writeInitFile } from "./writeInitFile";
import { Command } from "commander";
import { mkdirp } from "mkdirp";

export const genCfgFunctions = (
  inPath: string,
  outDir: string,
  fileName: string
) => {
  const functionStrings = findAllsqfFiles(inPath);
  const functions = parseFunctionsFromSingleFiles(functionStrings);
  const cfgString = cfgFunctions(functions);
  writeInitFile(cfgString, outDir, fileName);
  //compile functions themselves
  functions.forEach((f) => {
    const directory = outDir + "/functions/" + f.tag + "/";
    f.filePath = directory + "fn_" + f.pureName + ".sqf";
    mkdirp.sync(directory);
  });
  functions.forEach(saveSqfFunctionToCfgFile);
};

export const addBuildCfgFunctionsAction = (program: Command) => {
  program
    .command("cfg")
    .description(
      "Generate a cfg function .hpp file and function library for a working directory of functions."
    )
    .argument("<functions root>", "root of functions library to parse")
    .argument(
      "[output directory]",
      "directory to write cfg functions and function library to",
      "."
    )
    .argument(
      "[hpp filename]",
      "name of the hpp config file",
      "description.ext"
    )
    .action((inRoot: string, targetDir: string, hppFilename: string) => {
      genCfgFunctions(inRoot, targetDir, hppFilename);
    });
};
