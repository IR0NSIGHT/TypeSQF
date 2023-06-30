export type sqfFunction = {
  globalName: string;
  filePath: string | null;
  docString: string | null;
  flags: cfgFlags;
  code: string;
  tag: string;
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

export type compileTarget = "cfg" | "sqf" | "doc";

export function isSqfFunction(fnc: sqfFunction | null): fnc is sqfFunction {
  return fnc !== null;
}
