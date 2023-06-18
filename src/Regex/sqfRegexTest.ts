import assert from "assert";
import { completeFunctionRgx, functionBodyRgx, globalFncDef, globalFunctionsRgx, starCommentsRgx } from "./sqfRegex";

assert(globalFunctionsRgx.test("fnc_owoBoi"),);
assert(globalFunctionsRgx.test("fnc_a"),); 
assert(globalFunctionsRgx.test("irn_fnc_a")); 
assert(globalFunctionsRgx.test("irn_ambience_owoboi_fnc_a")); 
assert(!globalFunctionsRgx.test("_irn_ambience_owoboi_fnc_a")); 
assert(!globalFunctionsRgx.test("\r\nirn_ambience_owoboi_fnc_a")); 

assert(globalFncDef.test("fnc_owoBoi = {"),"fnc_owoBoi = {");
assert(globalFncDef.test("fnc_owoBoiffffff   =    {"));

assert(starCommentsRgx.test("/** owo */"));
assert(starCommentsRgx.test("/**\r\n*owo */")); 
assert(starCommentsRgx.test("/**\r\n*owo  gj * sdfgh \r\n  *  owo sgddsg*/"));
assert(starCommentsRgx.test("/**\r\n*owo  gj * sdfgh \r\n  *  owo sgddsg/r/n*/"));
assert(starCommentsRgx.test('/**\r\n' +
' *\r\n' +
' *\r\n*/')) 
assert(starCommentsRgx.test("// owo"))

assert(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n};"))
assert(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n \r\n};"))
assert(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n abcde \r\n fghij \r\n};"))
assert(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n abcde {\r\n fghij}; \r\n};"))
assert(functionBodyRgx.test("\r\nfnc_owoBoi = {\r\n{}; \r\n};"))
assert(functionBodyRgx.test('\r\n'+'fnc_fortifyCrossroads = { params ["_posASL","_range"]; \r\n};'));
assert(functionBodyRgx.test('\r\n'+'fnc_fortifyCrossroads = {\r\nparams ["_posASL","_range"]; \r\n};'));

const multilineFnc = ' */\r\n' +'fnc_blockRoad = { params[["_road",-1,[objNull]],["_barrierComposition",-1,[[]]]];\r\n' +
'    assert (_road isEqualType objNull);\r\n' +
'    assert (_barrierComposition isEqualType []);\r\n' +
'    _info = getRoadInfo _road;\r\n' +
'    _roadStart = _info#6;\r\n' +
'    _roadEnd = _info#7;\r\n' +
'    _randPoint = random 1;\r\n' +
'    _pos = (_roadStart vectorMultiply _randPoint) vectorAdd (_roadEnd vectorMultiply (1-_randPoint));\r\n' +
'    _dir =  (([_road] call fnc_getRoadDir) +selectRandom[0,180]+random[-10,0,10])%360;\r\n' +
'    _objs = [_pos,_dir, _barrierComposition, 0] call fnc_spawnComposition;\r\n' +
'    _objs\r\n' +
'};';
assert(functionBodyRgx.test(multilineFnc));
assert(completeFunctionRgx.test("\r\nfnc_owoBoi = {\r\n abcde {\r\n fghij}; \r\n};"))
assert(completeFunctionRgx.test("\r\nfnc_owoBoi = {\r\n _localThing = {...};\r\n};"))