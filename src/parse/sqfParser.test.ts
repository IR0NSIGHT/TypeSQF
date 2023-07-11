import { extractFunction, parseFunctionsFromString, parseFunctionsFromSingleFiles} from "./sqfParser"

describe("parse sqf files",()=> {
    test("read an LF sqf single-function-exectuable",()=>{
        expect(true).toBeTruthy()
        const lfSqfFilePath = "./test_data/input/lf_sqf_executable.sqf"
        const functions = parseFunctionsFromSingleFiles([lfSqfFilePath])
        expect(functions.length).toBe(1)
        expect(functions[0].globalName).toBe("irn_fnc_lfFunction")
    })

    test("read an CRLF sqf single-function-exectuable",()=>{
        expect(true).toBeTruthy()
        const lfSqfFilePath = "./test_data/input/crlf_sqf_executable.sqf"
        const functions = parseFunctionsFromSingleFiles([lfSqfFilePath])
        expect(functions.length).toBe(1)
        expect(functions[0].globalName).toBe("irn_fnc_crlfFunction")
    })

    test("can read function that isnt perfectly formatted",()=>{
        const fncString = "irn_fnc_owo={diag_log['unga bunga'];}   \r\n"
        const fncObj = parseFunctionsFromString(fncString);
        expect(fncObj?.globalName).toBe("irn_fnc_owo")
    })

})

describe("extract function from string", () => {
    test("single function in one string",()=>{
        const fncString = "hello world 1; irn_fnc_owo={diag_log['unga bunga'];}; hello world 2;"
        const fncObj = extractFunction(fncString);
        expect(fncObj).not.toBeUndefined()
        expect(fncObj!.name).toBe("irn_fnc_owo")
        expect(fncObj!.body).toBe("diag_log['unga bunga'];")
        expect(fncObj!.remaining).toBe("hello world 1; ; hello world 2;")
    })
})