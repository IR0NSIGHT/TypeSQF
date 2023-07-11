import {extractScope, findScopeBegin, findScopeEnd} from "./scopeParser"
import {cfgFlags, isSqfFunction, sqfFunction} from "../sqfTypes";
import * as fs from "fs";
import {globSync} from 'glob'

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

/**
 * extract the first function in the string
 * @param input
 * @returns name and body of function, remaining is input with the function declaration removed.
 */
export const extractFunction = (input: string): { name: string, body: string, remaining: string } | undefined => {
    const fncDeclaration = new RegExp(/ [a-zA-Z]\w* *= *{/, "g")

    //find the beginning of the function scope
    const firstIndex = input.search(fncDeclaration)
    if (firstIndex == -1)
        return undefined
    const lastIndex = findScopeEnd(input, firstIndex)
    const fncString = input.substring(firstIndex, lastIndex + 1)
    const scope = extractScope(fncString)
    if (scope === undefined) {
        return undefined
    }

    const name = fncString.match(/ [a-zA-Z]\w*/)![0].substring(1)
    const body = scope.scope.substring(findScopeBegin(scope.scope, /{/) + 1, scope.scope.length - 1)
    const remaining = input.substring(0, firstIndex) + input.substring(lastIndex + 1)
    return {name: name, body: body, remaining: remaining.replace(fncString, "")}
}

/**
 * extracts functions and returns parsed functions + remaining input string after extraction
 * @param input
 */
export const extractFunctionsFromString = (input: string): { functions: sqfFunction[], remaining: string } => {
    let fnc = input
    fnc = " " + fnc + " "
    fnc = unifyLinebreaks(fnc);
    fnc = removeLinebreaks(fnc);

    const extracted = extractFunction(fnc)
    if (extracted === undefined)
        return {functions: [], remaining: input}

    const {name, body} = extracted

    const flags: cfgFlags = parseFunctionFlags(""); //FIXME
    const pureName = name.replace(/.*fnc_/, "");
    const tag = name.replace(/_fnc.*/, "");
    return {
        functions: [{
            globalName: name,
            code: body,
            docString: "//docString",
            filePath: "",
            flags: flags,
            pureName: pureName,
            tag: tag,
        }], remaining: fnc
    }
};

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
        .replace(new RegExp("\n", "g"), "\r\n") //lf to crlf
}

const removeLinebreaks = (input: string): string => {
    return input.replace(new RegExp("[\r\n]+"), "")
}

export const parseFunctionsFromSingleFiles = (
    filePaths: string[]
): sqfFunction[] => {
    const functions: sqfFunction[] = filePaths
        .flatMap((file): sqfFunction[] => {
            const parsedFnc = extractFunctionsFromString(readFile(file)).functions;
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
