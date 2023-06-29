import {
  functionBodyRgx,
  globalFncDef,
  starCommentsRgx,
} from "../Regex/sqfRegex";
import { cfgFlags, isSqfFunction, sqfFunction } from "../sqfTypes";
import * as fs from "fs";

export const parseFunction = (fnc: string): sqfFunction | null => {
  const nameMatch = fnc.match(globalFncDef);
  if (nameMatch === null) {
    console.error("no name match");
    return null;
  }
  const name = nameMatch[0].replace(/ *= *{/, "").replace("\r\n", "");
  const bodyMatch = fnc.match(functionBodyRgx);
  if (bodyMatch === null) {
    console.error("no body match");
    return null;
  }
  const body = bodyMatch[0]
    .replace(globalFncDef, "")
    .replace("\r\n};", "")
    .replace(/\r\n  ? ? ?/g, "\r\n");

  const docString = (() => {
    const match = fnc.match(starCommentsRgx);
    if (match !== null) return match[0];
    else {
      return "/** DOCSTRING */";
    }
  })();
  const flags: cfgFlags = parseFunctionFlags(docString);
  const pureName = name.replace(".*fnc_", "");
  const tag = name.replace(/_fnc.*/, "");
  const cat = null; //TODO read from somewhere, ideally folder structure
  return {
    globalName: name,
    code: body,
    description: docString,
    filePath: "",
    flags: flags,
    returns: "",
    pureName: pureName,
    tag: tag,
    category: cat,
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

export const parseFunctionsFromSingleFiles = (
  filePaths: string[]
): sqfFunction[] => {
  const functions: sqfFunction[] = filePaths
    .map((file): sqfFunction | null => {
      const parsedFnc = parseFunction(fs.readFileSync(file, "utf-8"));
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
  return functions;
};

export const findAllSQFs = (path: string, recurse: boolean): string[] => {
  //console.log("collect sqf in folder:",path);
  const objs = fs.readdirSync(path).map((file) => path + "/" + file);
  const sqfs = objs.filter(
    (obj) => /.sqf$/.test(obj) && fs.statSync(obj).isFile()
  );
  console.log(path, sqfs);
  if (recurse) {
    const subFolders = objs
      .filter((obj) => fs.statSync(obj).isDirectory())
      .map((folder) => {
        return { name: folder, path: path + "/" + folder };
      });
    const subSQF = subFolders.flatMap((f) =>
      findAllSQFs(f.path, true).map((sqf) => f.name + "/" + sqf)
    );
    return sqfs.concat(subSQF);
  }
  return sqfs;
};
