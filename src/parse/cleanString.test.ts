import {cleanStringAfterParsing, cleanStringForParsing} from "./cleanString";

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
        expect(final).toBe(input)
    })
})