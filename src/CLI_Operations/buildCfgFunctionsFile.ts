import { cfgFunctions } from "../compile/compileCfg";
import { findAllSQFs, parseFunctionsFromSingleFiles } from "../parse/sqfParser";
import { writeInitFile } from "./writeInitFile";

export const genCfgFunctions = (inPath: string, outDir: string, fileName: string) => {
  const functions = parseFunctionsFromSingleFiles(findAllSQFs(inPath, true));
  const cfgString = cfgFunctions(functions);
  writeInitFile(cfgString, outDir, fileName);
};
