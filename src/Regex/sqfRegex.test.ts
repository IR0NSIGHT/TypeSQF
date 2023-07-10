import {
    completeFunctionRgx,
    functionBodyRgx,
    globalFncDef,
    globalFunctionsRgx,
    starCommentsRgx,
} from "./sqfRegex";

test("globalFunctionsRgx matches valid function names", () => {
    expect(globalFunctionsRgx.test("fnc_owoBoi")).toBe(true);
    expect(globalFunctionsRgx.test("fnc_a")).toBe(true);
    expect(globalFunctionsRgx.test("irn_fnc_a")).toBe(true);
    expect(globalFunctionsRgx.test("irn_ambience_owoboi_fnc_a")).toBe(true);
    expect(globalFunctionsRgx.test("_irn_ambience_owoboi_fnc_a")).toBe(false);
    expect(globalFunctionsRgx.test("\r\nirn_ambience_owoboi_fnc_a")).toBe(true);
});

test("globalFncDef matches valid function definitions", () => {
    expect(globalFncDef.test("fnc_owoBoi = {")).toBe(true);
    expect(globalFncDef.test("fnc_owoBoiffffff   =    {")).toBe(true);
});

test("starCommentsRgx matches star-style comments", () => {
    expect(starCommentsRgx.test("/** owo */")).toBe(true);
    expect(starCommentsRgx.test("/**\r\n*owo */")).toBe(true);
    expect(starCommentsRgx.test("/**\r\n*owo  gj * sdfgh \r\n  *  owo sgddsg*/")).toBe(true);
    expect(starCommentsRgx.test("/**\r\n*owo  gj * sdfgh \r\n  *  owo sgddsg/r/n*/")).toBe(true);
    expect(starCommentsRgx.test('/**\r\n' +
        ' *\r\n' +
        ' *\r\n*/')).toBe(true);
    expect(starCommentsRgx.test("// owo")).toBe(true);
    expect(starCommentsRgx.test("hello world")).toBe(false)
});

test("functionBodyRgx matches valid function bodies", () => {
    expect(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n};")).toBe(true);
    expect(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n \r\n};")).toBe(true);
    expect(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n abcde \r\n fghij \r\n};")).toBe(true);
    expect(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n abcde {\r\n fghij}; \r\n};")).toBe(true);
    expect(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n{}; \r\n};")).toBe(true);
    expect(functionBodyRgx.test('\r\n' + 'fnc_fortifyCrossroads = { params ["_posASL","_range"]; \r\n};')).toBe(true);
    expect(functionBodyRgx.test('\r\n' + 'fnc_fortifyCrossroads = {\r\nparams ["_posASL","_range"]; \r\n};')).toBe(true);
});

test("completeFunctionRgx matches complete function definitions", () => {
    expect(completeFunctionRgx.test("\r\nfnc_owoBoi = {\r\n abcde {\r\n fghij}; \r\n};")).toBe(true);
    expect(completeFunctionRgx.test("\r\nfnc_owoBoi = {\r\n _localThing = {...};\r\n};")).toBe(true);
});