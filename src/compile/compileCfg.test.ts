import { sqfFunction } from "../sqfTypes";
import { cfgFunctions } from "./compileCfg";
describe("generate cfg functions string", () => {
  test("single function cfg ", () => {
    const fnc: sqfFunction = {
      globalName: "irn_fnc_test",
      filePath: null,
      docString: null,
      flags: {
        preInit: false,
        postInit: false,
        preStart: false,
        recompile: false,
      },
      code: "diag_log ['hello world'];",
      tag: "irn",
      pureName: "test",
    };

    const cfgClass = cfgFunctions([fnc]);
    expect(cfgClass).toContain("class CfgFunctions {");
    expect(cfgClass).toContain("class irn {");
    expect(cfgClass).toContain("class test {");

    expect(cfgClass).not.toContain("preInit = 1;");
    expect(cfgClass).not.toContain("postInit = 1;");
    expect(cfgClass).not.toContain("preStart = 1;");
    expect(cfgClass).not.toContain("recompile = 1;");
  });

  test("single function with flags", () => {
    const fnc: sqfFunction = {
      globalName: "irn_fnc_test",
      filePath: null,
      docString: null,
      flags: {
        preInit: true,
        postInit: true,
        preStart: true,
        recompile: true,
      },
      code: "diag_log ['hello world'];",
      tag: "irn",
      pureName: "test",
    };

    const cfgClass = cfgFunctions([fnc]);
    expect(cfgClass).toContain("preInit = 1;");
    expect(cfgClass).toContain("postInit = 1;");
    expect(cfgClass).toContain("preStart = 1;");
    expect(cfgClass).toContain("recompile = 1;");
  });
})

