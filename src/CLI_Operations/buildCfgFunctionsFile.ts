import { program } from "commander";
import { cfgFunctions } from "../compile/compileCfg";
import { findAllSQFs, parseFunctionsFromSingleFiles } from "../parse/sqfParser";
import { writeInitFile } from "./writeInitFile";
import { Command } from "commander";

export const genCfgFunctions = (
  inPath: string,
  outDir: string,
  fileName: string
) => {
  const functions = parseFunctionsFromSingleFiles(findAllSQFs(inPath, true));
  const cfgString = cfgFunctions(functions);
  writeInitFile(cfgString, outDir, fileName);
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
      console.log(
        "perform compile to cfgFunctions on root ",
        inRoot,
        " towards dir ",
        targetDir,
        " with hpp filename:",
        hppFilename
      );
      genCfgFunctions(inRoot, targetDir, hppFilename);
    });
};
