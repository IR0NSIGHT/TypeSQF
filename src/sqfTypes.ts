export type sqfFunction = {
  globalName: string;
  filePath: string | null;
  docString: string | null;
  flags: cfgFlags;
  returns: string;
  code: string;
  tag: string;
  category: string | null;
  pureName: string;
};

export type cfgFlags = {
  preInit: boolean;
  postInit: boolean;
  preStart: boolean;
  recompile: boolean;
};

export function hasFilePath(fnc: sqfFunction): boolean {
  return fnc.filePath !== null;
}

export type codeType = "cfg" | "sqf" | "doc";

export function isSqfFunction(fnc: sqfFunction | null): fnc is sqfFunction {
  return fnc !== null;
}
