import * as fs from "fs";
import { completeFunctionRgx } from "../Regex/sqfRegex";
import { parseFunction } from "../parse/sqfParser";
import { sqfFunction, isSqfFunction } from "../sqfTypes";
import { saveSqfFunctionToExecutableFile } from "../compile/compileSqf";
import { Command } from "commander";
const sliceToFunctions = (myString: string, rgx: RegExp): string[] | null => {
  var fncRgx = new RegExp(rgx.source, "g");
  var functions = myString.match(fncRgx);
  return functions as string[] | null;
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

  //remove parsed functions from blobfile
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

  const functionBlobs = sliceToFunctions(allFileContents, completeFunctionRgx);
  if (functionBlobs === null) {
    //fail early if no functions were found by the matcher
    console.log("no function declarations were found in blobfile, abort");
    return "";
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

export type splitBlobParams = {
  __type: "splitBlob"
  blobfilePath: string;
  initFlag: boolean;
  removeFlag: boolean;
};

export const addSplitBlobAction = (program: Command) => {
  program
  .command("split")
  .description(
    "Split a blobfile containing many function declarations into single-function-file executables."
  )
  .argument("<blobfile>", "input path of blobfile")
  .argument("[output directory]", "directory to write function files to", ".")
  .option("--init", "init the functions from the blobfile")
  .option("--remove", "remove the parsed functions from the blobfile")
  .action(
    (
      inPath: string,
      targetDir: string,
      options: { init: boolean | undefined; remove: boolean | undefined }
    ) => {
      //  const initFlag = options.init ? true : false;
      const removeFlag = options.remove ? true : false;

      console.log(
        "perform split on file ",
        inPath,
        " towards dir ",
        targetDir,
        " with deletion:",
        removeFlag
      );
      performSplit(inPath, targetDir, removeFlag);
    }
  );
}