import * as fs from "fs";
import {readFile} from "../parse/sqfParser";
import {sqfFunction} from "../sqfTypes";
import {saveSqfFunctionToExecutableFile} from "../compile/compileSqf";
import {Command} from "commander";
import {mkdirp} from "mkdirp";
import {extractAllFunctionsFrom} from "../parse/extractFunction"

const warnDocstringDoesntExist = (fnc: sqfFunction) => {
    if (fnc.docString === null)
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
 * @param deleteAfterExtraction
 * @returns
 */
export const performSplit = (
    inPath: string,
    outDir: string,
    deleteAfterExtraction: boolean
) => {
    if (!fs.lstatSync(inPath).isFile()) {
        runtimeErr("input file is not a file:\t'" + inPath + "'\t.", "split");
        return "";
    }
    const allFileContents = readFile(inPath)

    const {functions, remaining} = extractAllFunctionsFrom(allFileContents);

    //remove parsed functions from blobfile
    if (deleteAfterExtraction) {
        console.log("overwrite input file after deletion:", inPath);
        const lengthBefore = allFileContents.length;
        const lengthNow = remaining.length;

        console.log("removed ", lengthBefore - lengthNow, " characters.");
        fs.writeFile(inPath, remaining, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    //handle the extracted strings
    const parsedFncs = functions
    parsedFncs.forEach(warnDocstringDoesntExist);

    //fncs dont have filepath bc they originate from a blob file
    parsedFncs.forEach((fnc) => {
        fnc.filePath = outDir + "/" + fnc.globalName + ".sqf";
    });
    mkdirp.sync(outDir)
    parsedFncs.forEach(saveSqfFunctionToExecutableFile);
    return 1;
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
                performSplit(inPath, targetDir, removeFlag);
            }
        );
};
