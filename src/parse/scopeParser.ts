/**
 * 
 * @param myInput MUST start with the opening bracket.
 * @returns index of input string where scope closes
 */
export const findScopeEnd = (myInput: string): number => {
    let count = 0;
    for (let i = 0; i < myInput.length; i++) {
      const char = myInput[i]
      if (char === "}")
        count --
      else if (char === "{")
        count ++
      
      if (count == 0)
        return i
    }
    return -1
}

/**
 * 
 * @param input must start with opening bracket
 */
export const extractScope = (input: string): {scope: string|-1, remaining: string} => {
    const closingIdx = findScopeEnd(input)
    if (closingIdx === -1)
        return {scope: -1, remaining: input}
    else {
        const scopeString = input.substring(0,closingIdx+1)
        const remainder = input.substring(closingIdx+1)
        return {scope: scopeString, remaining: remainder}
    }
}

/**
 * 
 * @param input 
 * @param pattern must be valid regex.
 * @returns 
 */
export const findScopeBegin = (input: string, pattern: RegExp): number => {
    console.log("search pattern ", pattern, " in ", input)
    return input.search(pattern)
}