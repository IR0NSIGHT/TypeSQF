/**
 *
 * @param myInput text input to search function in
 * @param startIdx index in input string to start searching from.
 * @returns index of input string where scope closes
 */
export const findScopeEnd = (myInput: string, startIdx: number): number => {
    let count = 0;
    let init = false;
    for (let i = startIdx; i < myInput.length; i++) {
        const char = myInput[i]

        if (char === "}")
            count--
        else if (char === "{")
            count++

        if (count != 0)
            init = true

        if (init && count == 0) {
            return i
        }
    }
    return -1
}

/**
 *
 * @param input must start with opening bracket
 */
export const extractScope = (input: string): {
    scope: string,
    remaining: string,
    index: { start: number, end: number }
} | undefined => {
    const closingIdx = findScopeEnd(input, 0)
    if (closingIdx === -1)
        return undefined
    else {
        const scopeString = input.substring(0, closingIdx + 1)
        const remainder = input.substring(closingIdx + 1)
        return {scope: scopeString, remaining: remainder, index: {start: 0, end: closingIdx}}
    }
}

/**
 *
 * @param input
 * @param pattern must be valid regex.
 * @returns
 */
export const findScopeBegin = (input: string, pattern: RegExp): number => {
    return input.search(pattern)
}