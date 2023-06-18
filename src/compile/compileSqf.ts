import { cfgFlags, codeType, sqfFunction } from "../sqfTypes";
import { writeFile } from "../app";

export const compileInitForFunctions = (functions: sqfFunction[]) => {
  let useFunctionDef = false;
  let functionDef = "//FUNCTION DEFINTION\r\nprivate '_h';\r\n";
  functions.forEach(fnc => {useFunctionDef = true; functionDef += ("_h = [] execVM '"+fnc.filePath?.replace("/","\\")+"';\r\n waitUntil { scriptDone _h };\r\n")});


  let usepreStart = false;
  let preStart = "//PRESTART\r\n";
  functions.forEach(fnc => {if (fnc.flags.preStart) {usepreStart = true; preStart+= "[] call "+fnc.globalName+";\r\n"}});

  let usepreInit = false;
  let preInit = "//PREINIT\r\n";
  functions.forEach(fnc => {if (fnc.flags.preInit) {usepreInit = true; preInit+= "['preInit'] call "+fnc.globalName+";\r\n"}});

  let usepostInit = false;
  let postInit = "//POSTINIT\r\n";
  functions.forEach(fnc => {if (fnc.flags.postInit) {usepostInit = true; postInit+= "['postInit', false] spawn "+fnc.globalName+";\r\n"}});

  let init = "// autogen init\r\n";
  init += (useFunctionDef?functionDef:"");
  init += (usepreStart?preStart:"");
  init += (usepreInit?preInit:"");
  init += (usepostInit?postInit:"");
  return init+"hint('INIT');";
};

export function indent(s: string, spacer: string, amount: number): string {
  return s.replace(/\r\n$/,"").replace(/\r\n/g,"\r\n"+spacer.repeat(amount)).replace(/^/,spacer.repeat(amount))+"\r\n";
}

export function compileSqfFunction(fnc: sqfFunction, type: codeType): string {
  switch (type) {
    case "cfg":
      return fnc.code
    case "sqf":
      return fnc.globalName + " = {\r\n" + indent(fnc.code,"",3) + "};\r\n";
    default:
      throw new Error("invalid compile type");
  }
}

export const saveSqfFunction = (fnc: sqfFunction):void => {
  if (fnc.filePath !== null)
    writeFile(compileSqfFunction(fnc,"sqf"),fnc.filePath)
  else
    console.warn("can not write to file for function",fnc);
}

/**
 * compile flags into writable code to export into files.
 * @param flags 
 * @param type 
 * @returns pure code with linebreaks between flags, no indent
 */
export const compileFlags = (flags: cfgFlags, type: codeType = "sqf"):string => {
  let out = "";
  switch (type) {
    case "cfg": {
      if (flags.preInit) out += "preInit = 1;\r\n";
      if (flags.postInit) out += "postInit = 1;\r\n";
      if (flags.preStart) out += "pospreStarttInit = 1;\r\n";
      if (flags.recompile) out += "recompile = 1;\r\n";
      break;
    }
    case "doc": {
      if (flags.preInit) out += "@preInit\r\n";
      if (flags.postInit) out += "@postInit\r\n";
      if (flags.preStart) out += "@pospreStarttInit\r\n";
      if (flags.recompile) out += "@recompile \r\n";
      break;
    }
    case "sqf":
    default: throw new Error("unknown code type for flag compiler:"+ type);
  }
  return out
}