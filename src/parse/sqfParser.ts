import {cfgFlags, isSqfFunction, sqfFunction} from "../sqfTypes";
import * as fs from "fs";
import {globSync} from 'glob'
import {extractAllFunctionsFrom} from "./extractFunction";

export const addMissingDocstrings = (
    fncs: sqfFunction[],
    docString?: string
): sqfFunction[] => {
    const docu = (
        docString ? docString : "/*default docstring :(\r\n*/"
    ) as string;
    return fncs.map((fnc) => {
        fnc = {...fnc};
        if (fnc.docString === "") {
            fnc.docString = docu;
        }
        return fnc;
    });
};


export const cleanStringForParsing = (input: string): string => {
    input = unifyLinebreaks(input)
    input = " " + input + " "   //pad
    return input
}

export const cleanStringAfterParsing = (input: string): string => {
    const out = input.substring(1, input.length - 1)
        .replace(new RegExp(" \n ","g"),"\n")
        .replace(new RegExp(/;(( |\n)*;)+/,"g"),";") //remove space padding at end and start
    return  out;
}

export const parseFunctionFlags = (docString: string): cfgFlags => {
    const flags: cfgFlags = {
        preInit: false,
        postInit: false,
        preStart: false,
        recompile: false,
    };
    flags.postInit = new RegExp("@postInit").test(docString);
    flags.preInit = new RegExp("@preInit").test(docString);
    flags.preStart = new RegExp("@preStart").test(docString);
    flags.recompile = new RegExp("@recompile").test(docString);
    return flags;
};

export const readFile = (filePath: string): string => {
    const outString = fs.readFileSync(filePath, "utf-8")
    return outString
}

/**
 * unifies linebreaks
 * @param input
 * @returns
 */
const unifyLinebreaks = (input: string): string => {
    return input.replace(new RegExp("\r\n", "g"), "\n") //crlf to LF
       .replace(new RegExp("\n", "g"), " \n ") //lf to crlf
}

export const parseFunctionsFromSingleFiles = (
    filePaths: string[]
): sqfFunction[] => {
    const functions: sqfFunction[] = filePaths
        .flatMap((file): sqfFunction[] => {
            const parsedFnc = extractAllFunctionsFrom(readFile(file)).functions;
            if (parsedFnc.length !== 0) {
                parsedFnc[0].filePath = file;
            } else {
                console.warn(
                    "file path " + file + " could not be parsed into an sqf function."
                );
            }
            return parsedFnc;
        })
        .filter(isSqfFunction);
    return addMissingDocstrings(functions);
};

/**
 * collect all filepaths starting with dirPath that end in .sqf
 * @param dirPath
 * @returns string array of paths from dirPath (including dirPath)
 */
export const findAllsqfFiles = (dirPath: string): string[] => {
    const allSqfFiles = globSync(dirPath + '/**/*.sqf')
    return allSqfFiles;
};
