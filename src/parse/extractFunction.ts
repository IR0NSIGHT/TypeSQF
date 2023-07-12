import { parseFunctionFlags} from "./sqfParser";
import {cfgFlags, sqfFunction} from "../sqfTypes";
import {extractScope, findScopeBegin, findScopeEnd} from "./scopeParser";
import {cleanStringAfterParsing, cleanStringForParsing} from "./cleanString";

/**
 * extracts functions and returns parsed functions + remaining input string after extraction
 * @param rawString unprepared string
 */
export const extractAllFunctionsFrom = (rawString: string): { functions: sqfFunction[], remaining: string } => {
    let remainingString = cleanStringForParsing(rawString);
    const extractedFncs: sqfFunction[] = [];
    while (remainingString.length > 0) {

        const extracted = extractFirstFunctionFrom(remainingString)
        if (extracted === undefined)
            break

        const {name, body, remaining} = extracted
        remainingString = remaining

        const flags: cfgFlags = parseFunctionFlags(""); //FIXME
        const pureName = name.replace(/.*fnc_/, "");
        const tag = name.replace(/_fnc.*/, "");
        const sqfFnc = {
            globalName: name,
            code: body,
            docString: "//docString",
            filePath: "",
            flags: flags,
            pureName: pureName,
            tag: tag,
        }
        extractedFncs.push(sqfFnc)
    }

    return {
        functions: extractedFncs, remaining: cleanStringAfterParsing(remainingString)
    }
};


/**
 * extract the first function in the string
 * @param input
 * @returns name and body of function, remaining is input with the function declaration removed.
 */
export const extractFirstFunctionFrom = (input: string): { name: string, body: string, remaining: string } | undefined => {
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