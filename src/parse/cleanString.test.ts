import {cleanStringAfterParsing, cleanStringForParsing, unifyCommentsForParsing} from "./cleanString";

describe("clean string after parsing", () => {
    test("removes padding",()=>{
        const padded = " owo "
        const cleaned = cleanStringAfterParsing(padded)
        expect(cleaned).toBe("owo")
    })

    test("removes padded linebreaks",()=>{
        const padded = " owo \n uwu "
        const cleaned = cleanStringAfterParsing(padded)
        expect(cleaned).toBe("owo\nuwu")
    })

    test("removes chained ;;",()=>{
        const padded = " owo;;; ; ;  ;; ; ;\n; uwu "
        const cleaned = cleanStringAfterParsing(padded)
        expect(cleaned).toBe("owo; uwu")
    })
})

describe("clean for and after nulls out",()=>{
    test("",()=>{
        const input = "irn_fnc_helloWorld = {\n\n};\n"
        const final = cleanStringAfterParsing(cleanStringForParsing(input))
        expect(final).toBe( "irn_fnc_helloWorld = {\n};\n")
    })
})

describe("comment formatting",()=>{
    test("bad single line comment",()=>{
        const input = "abc//def//"
        const final = unifyCommentsForParsing(input)
        expect(final).toBe("abc\n//def//")
    })
    test("bad multi line comment",()=>{
        const input = "abc/*def*/"
        const final = unifyCommentsForParsing(input)
        expect(final).toBe("abc\n/*\ndef\n*/\n")
    })
})