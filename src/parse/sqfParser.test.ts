import { parseFunctionsFromSingleFiles} from "./sqfParser"

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
})