import { Command } from "commander";
import { writeFile } from "../compile/writeFile";
import * as fs from "fs";
import { compileFileInit } from "../compile/compileSqf";
import { findAllSQFs, parseFunctionsFromSingleFiles } from "../parse/sqfParser";

export const writeInitFile = (code: string, dir: string, fileName: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = dir != "." ? dir + "/" + fileName : fileName;
  return writeFile(code, filePath);
};

export const addWriteInitAction = (program: Command) => {
  program
    .command("init")
    .description(
      "Write an init file that execVMs and loads/reloads the functions dynamically during runtime"
    )
    .argument("<library root>", "root of functions library")
    .argument("[output directory]", "directory to write init file to", ".")
    .argument("[filename]", "filename for the executable sqf", "init.sqf")
    .action((inPath: string, targetDir: string, fileName: string) => {
      const missionRoot = inPath;
      //expects folder structure such as: . -> functions -> irn_fnc_owo.sqf
      const files = findAllSQFs(missionRoot, true).filter((f: string) =>
        /fnc/.test(f)
      );
      const functions = parseFunctionsFromSingleFiles(files);
      //paths now relative to mission root for execVM
      functions.forEach((f) => {
        f.filePath =
          f.filePath?.replace(new RegExp("^" + missionRoot + "/"), "") ?? null;
      });

      const loadFncsCode = compileFileInit(functions);
      const initFile = writeInitFile(loadFncsCode, targetDir, fileName);
      console.log("wrote init file: " + initFile);
    });
};
