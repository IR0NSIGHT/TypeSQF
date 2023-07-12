/**
 * makes a raw string ready for parsing.
 * pads with whitespace, unifies to LF. pads linebreaks etc
 * @param input
 */
export const cleanStringForParsing = (input: string): string => {
    input = unifyLinebreaksForParsing(input)
    input = unifyCommentsForParsing(input)
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

export const unifyCommentsForParsing = (input: string): string => {

    const rows = input.split("\n")
        .map(r => r.replace("//","\n//")
            .replace("/*","\n/*\n")
            .replace("*/","\n*/\n")
        )
    return rows.join("\n")
}

export const cleanStringAfterParsing = (input: string): string => {
    const out = input.substring(1, input.length - 1) //remove space padding at end and start
        .replace(new RegExp(" \n ","g"),"\n")
        .replace(new RegExp(/;(( |\n)*;)+/,"g"),";")
        .replace(new RegExp(/ *\n+ */,"g"),"\n")    //multi line breaks into single line break
    return  out;
}
