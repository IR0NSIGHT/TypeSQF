export const cleanStringForParsing = (input: string): string => {
    input = unifyLinebreaks(input)
    input = " " + input + " "   //pad
    return input
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

export const cleanStringAfterParsing = (input: string): string => {
    const out = input.substring(1, input.length - 1)
        .replace(new RegExp(" \n ","g"),"\n")
        .replace(new RegExp(/;(( |\n)*;)+/,"g"),";") //remove space padding at end and start
    return  out;
}
