/**
 * makes a raw string ready for parsing.
 * pads with whitespace, unifies to LF. pads linebreaks etc
 * @param input
 */
export const cleanStringForParsing = (input: string): string => {
    input = unifyLinebreaksForParsing(input)
    input = " " + input + " "   //pad
    return input
}

/**
 * unifies linebreaks
 * @param input
 * @returns
 */
const unifyLinebreaksForParsing = (input: string): string => {
    return input.replace(new RegExp("\r\n", "g"), "\n") //crlf to LF
        .replace(new RegExp("\n", "g"), " \n ") //lf to crlf
}

export const cleanStringAfterParsing = (input: string): string => {
    const out = input.substring(1, input.length - 1) //remove space padding at end and start
        .replace(new RegExp(" \n ","g"),"\n")
        .replace(new RegExp(/;(( |\n)*;)+/,"g"),";")
    return  out;
}
