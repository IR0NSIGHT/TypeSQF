import { sqfFunction } from "../sqfTypes";
import { compileFlags, indent } from "./compileSqf";

const cfgClassFromFunction = (fnc: sqfFunction) => {
    let basicString = "class " + fnc.pureName + " {";
    const flagString = compileFlags(fnc.flags,"cfg");
    if (flagString !== "")
        basicString += "\r\n"+indent(flagString," ",3);
    basicString += "};\r\n";
    console.log("flagstring:",flagString," for fnc \n", basicString);
    return basicString;
};

const cfgClassFromTag = (tag: string, fncs: sqfFunction[]) => {
    let cfgTag = "class " + tag + " {\r\n";
    fncs.forEach(f => cfgTag += indent(cfgClassFromFunction(f)," ",3))
    cfgTag += "};//"+tag+"\r\n";
    return cfgTag;
}

const collectTags = (fncs: sqfFunction[]): Map<string,sqfFunction[]> => {
    const tags = new Map<string,sqfFunction[]>();
    fncs.forEach(f => {
        let list: sqfFunction[] = tags.get(f.tag)??[];
        list.push(f);
        tags.set(f.tag,list);
    })
    return tags;
}

export const cfgFunctions = (functions: sqfFunction[]): string => {
    const tagMap = collectTags(functions);
    let cfgCode = "//autogen cfgFunctions\r\nclass CfgFunctions {\r\n";
    tagMap.forEach((fncs, tag) => {
        cfgCode += indent(cfgClassFromTag(tag, fncs)," ",3);
    })
    cfgCode +="};//cfgFunctions\r\n"
    return cfgCode;
};