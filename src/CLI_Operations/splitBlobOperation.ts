import * as fs from "fs";
import {sqfFunction} from "../sqfTypes";
import {saveSqfFunctionToExecutableFile} from "../compile/compileSqf";
import {Command} from "commander";
import {mkdirp} from "mkdirp";
import {extractAllFunctionsFrom} from "../parse/extractFunction"
import {findAllsqfFiles, readFile} from "../fileUtil";

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
        .argument("[output directory]", "directory to write function files to", "./functions")
        .argument("<blobfile(s)...>", "input path(s) of blobfile or directory to search sqfs in")
        .option("--init", "init the functions from the blobfile")
        .option("--remove", "remove the parsed functions from the blobfile")
        .action(
            (
                targetDir: string,
                inPaths: string[],
                options: { init: boolean | undefined; remove: boolean | undefined }
            ) => {
                //  const initFlag = options.init ? true : false;
                const removeFlag = options.remove ? true : false;
                const nonExisting = inPaths.filter(p => !fs.existsSync(p));
                if (nonExisting.length != 0) {
                    console.error("not all paths exist:", nonExisting)
                    return;
                }

                const existingPaths = inPaths.filter(p => fs.existsSync(p));
                const files = existingPaths.filter(path => fs.lstatSync(path).isFile())
                const dirs = existingPaths.filter(path => fs.lstatSync(path).isDirectory())
                dirs.forEach(d => files.push(...findAllsqfFiles(d)))

                console.log("split sqf files: ", files, " into target:", targetDir)

                files.forEach(f => performSplit(f, targetDir, removeFlag))

            }
        );
};
