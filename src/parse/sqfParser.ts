import {cfgFlags, isSqfFunction, sqfFunction} from "../sqfTypes";
import {extractAllFunctionsFrom} from "./extractFunction";
import {readFile} from "../fileUtil";

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

