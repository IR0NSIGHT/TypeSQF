import {extractFirstFunctionFrom, extractAllFunctionsFrom} from "./extractFunction";
import {cleanStringAfterParsing, cleanStringForParsing} from "./cleanString";


describe("extractFirstFunction from string", () => {
    test("single function in one string", () => {
        const fncString = "hello world 1; irn_fnc_owo={diag_log['unga bunga'];}; hello world 2;"
        const fncObj = extractFirstFunctionFrom(fncString);
        expect(fncObj).not.toBeUndefined()
        expect(fncObj!.name).toBe("irn_fnc_owo")
        expect(fncObj!.body).toBe("diag_log['unga bunga'];")
        expect(fncObj!.remaining).toBe("hello world 1;; hello world 2;")
    })
})

describe("extractAllFunctionsFrom from string", () => {
    test("can read function that isnt perfectly formatted", () => {
        const fncString = "irn_fnc_owo={diag_log['unga bunga'];}   \r\n"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(1)
        const fncObj = parsed.functions[0]
        expect(fncObj?.globalName).toBe("irn_fnc_owo")
    })

    test("does not read local function", () => {
        const fncString = "_irn_fnc_owo={diag_log['unga bunga'];}   \r\n"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(0)
        expect(parsed.remaining).toBe(cleanStringAfterParsing(cleanStringForParsing(fncString)))
    })

    test("reads function thats in the middle of string", () => {
        const fncString = "hello_world; irn_fnc_owo={diag_log['unga bunga'];} hello_world   \r\n"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(1)
        const fncObj = parsed.functions[0]
        expect(fncObj?.globalName).toBe("irn_fnc_owo")
    })

    test("reads unconventional function name", () => {
        const fncString = "hello_world; fnHelloWorld1234={diag_log['unga bunga'];} hello_world   \r\n"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(1)
        const fncObj = parsed.functions[0]
        expect(fncObj?.globalName).toBe("fnHelloWorld1234")
    })

    test("reads many functions", () => {
        const fncString = "xx fnc_a = {}; fnc_b = {};xx"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(2)
        const fnc_a = parsed.functions[0]
        const fnc_b = parsed.functions[1]
        expect(fnc_a.globalName).toBe("fnc_a")
        expect(fnc_b.globalName).toBe("fnc_b")
        expect(parsed.remaining).toBe("xx;xx")
    })

    test("reads many complicated", () => {
        const fncString = "irn_fnc_helloWorld = {\n" +
            "    diag_log \"owo\";\n" +
            "    if (true) then {\n" +
            "        owo;\n" +
            "    } else {\n" +
            "        uwu;\n" +
            "    }\n" +
            "};\n" +
            "\n" +
            "/**\n" +
            "this is documentation for doSomething\n" +
            "*/\n" +
            "irn_fnc_doSomething = {\n" +
            "    // fixme doesnt carry over documentation\n" +
            "    _m = \"this is a string\";\n" +
            "    systemChat _m;\n" +
            "};\n"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(2)
        const fnc_a = parsed.functions[0]
        const fnc_b = parsed.functions[1]
        expect(fnc_a.globalName).toBe("irn_fnc_helloWorld")
        expect(fnc_b.globalName).toBe("irn_fnc_doSomething")
    })

    test("removes many functions from input proper:",()=>{
        const fncString =
            "_start = '';\n"+
            "fnc_a1 = {\ndiag_log[]; _owo={};};\n" +
            "fnc_a2 = {\ndiag_log[]; _owo={};};\n" +
            "fnc_a3 = {\ndiag_log[]; _owo={};};\n" +
            "fnc_a4 = {\ndiag_log[]; _owo={};};\n" +
            "_end = '';"
        const parsed = extractAllFunctionsFrom(fncString);
        expect(parsed.functions.length).toBe(4)
        expect(parsed.remaining).toBe( "_start = '';\n"+ "_end = '';")
    })
})