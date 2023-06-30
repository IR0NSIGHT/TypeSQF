import { sqfFunction } from "../sqfTypes";
import { compileFlags } from "./compileSqf";
import { indent } from "./utility";

const cfgClassFromFunction = (fnc: sqfFunction) => {
  const lines = ["class " + fnc.pureName + " {"];
  const flagString = compileFlags(fnc.flags, "cfg");
  if (flagString !== "") lines.push(indent(flagString, " ", 3));
  lines.push("};");
  return lines.join("\r\n");
};

const cfgClassFromTag = (tag: string, fncs: sqfFunction[]) => {
  const lines = [];
  lines.push("class " + tag + " {");
  fncs.forEach((f) => lines.push(indent(cfgClassFromFunction(f), " ", 3)));
  lines.push("};//" + tag);
  return lines.join("\r\n");
};

const collectTags = (fncs: sqfFunction[]): Map<string, sqfFunction[]> => {
  const tags = new Map<string, sqfFunction[]>();
  fncs.forEach((f) => {
    let list: sqfFunction[] = tags.get(f.tag) ?? [];
    list.push(f);
    tags.set(f.tag, list);
  });
  return tags;
};

export const cfgFunctions = (functions: sqfFunction[]): string => {
  const tagMap = collectTags(functions);
  const cfgLines = ["//autogen cfgFunctions", "class CfgFunctions {"];
  tagMap.forEach((fncs, tag) => {
    cfgLines.push(indent(cfgClassFromTag(tag, fncs), " ", 3));
  });
  cfgLines.push("};//cfgFunctions");
  return cfgLines.join("\r\n");
};
