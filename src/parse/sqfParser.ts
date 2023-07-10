import {
  functionBodyRgx,
  globalDef,
  globalFncDef,
  starCommentsRgx,
} from "../Regex/sqfRegex";
import { extractScope } from "./scopeParser"
import { cfgFlags, isSqfFunction, sqfFunction } from "../sqfTypes";
import * as fs from "fs";
import { globSync } from 'glob'
export const addMissingDocstrings = (
  fncs: sqfFunction[],
  docString?: string
): sqfFunction[] => {
  const docu = (
    docString ? docString : "/*default docstring :(\r\n*/"
  ) as string;
  return fncs.map((fnc) => {
    fnc = { ...fnc };
    if (fnc.docString === "") {
      fnc.docString = docu;
    }
    return fnc;
  });
};

export const parseFunction = (fnc: string): sqfFunction | null => {
  fnc = unifyLinebreaks(fnc);
  fnc = removeLinebreaks(fnc);
  const nameMatch = fnc.match(globalFncDef);
  if (nameMatch === null) {
    console.error("no name match:", JSON.stringify(fnc), " for regex: ", JSON.stringify(globalFncDef));
    return null;
  }
  const name = nameMatch[0].replace(globalDef, "")

  //find the beginnign of the function scope
  const rgx = new RegExp(globalFncDef.source, "g")
  rgx.test(fnc)
  console.log("last idx: " + rgx.lastIndex)
  const reducedFnc = fnc.substring(rgx.lastIndex - 1)

  const scope = extractScope(reducedFnc)
  console.log("scope parsed:", scope)
  if (scope.scope === -1) {
    console.error("no body match:", JSON.stringify(fnc), " for regex: ", JSON.stringify(functionBodyRgx));
    return null;
  }
  const body = scope.scope.substring(1,scope.scope.length -1)

  const docString = (() => {
    const match = fnc.match(starCommentsRgx);
    if (match !== null) return match[0];
    else {
      return "";
    }
  })();
  const flags: cfgFlags = parseFunctionFlags(docString);
  const pureName = name.replace(/.*fnc_/, "");
  const tag = name.replace(/_fnc.*/, "");
  return {
    globalName: name,
    code: body,
    docString: docString,
    filePath: "",
    flags: flags,
    pureName: pureName,
    tag: tag,
  };
};

export const parseFunctionFlags = (docString: string): cfgFlags => {
  const flags: cfgFlags = {
    preInit: false,
    postInit: false,
    preStart: false,
    recompile: false,
  };
  flags.postInit = new RegExp("@postInit").test(docString);
  flags.preInit = new RegExp("@preInit").test(docString);
  flags.preStart = new RegExp("@preStart").test(docString);
  flags.recompile = new RegExp("@recompile").test(docString);
  return flags;
};

export const readFile = (filePath: string): string => {
  const outString = fs.readFileSync(filePath, "utf-8")
  return outString
}

/**
 * unifies linebreaks
 * @param input 
 * @returns 
 */
const unifyLinebreaks = (input: string): string => {
  return input.replace(new RegExp("\r\n", "g"), "\n") //crlf to LF
    .replace(new RegExp("\n", "g"), "\r\n") //lf to crlf
}

const removeLinebreaks = (input: string): string => {
  return input.replace(new RegExp("[\r\n]+"), "")
}

export const parseFunctionsFromSingleFiles = (
  filePaths: string[]
): sqfFunction[] => {
  const functions: sqfFunction[] = filePaths
    .map((file): sqfFunction | null => {
      const parsedFnc = parseFunction(readFile(file));
      if (parsedFnc !== null) {
        parsedFnc.filePath = file;
      } else {
        console.warn(
          "file path " + file + " could not be parsed into an sqf function."
        );
      }
      return parsedFnc;
    })
    .filter(isSqfFunction);
  return addMissingDocstrings(functions);
};

/**
 * collect all filepaths starting with dirPath that end in .sqf
 * @param dirPath 
 * @returns string array of paths from dirPath (including dirPath)
 */
export const findAllsqfFiles = (dirPath: string): string[] => {
  const allSqfFiles = globSync(dirPath + '/**/*.sqf')
  return allSqfFiles;
};
