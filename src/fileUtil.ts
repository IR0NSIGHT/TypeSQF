import {globSync} from "glob";
import * as fs from "fs";

export const readFile = (filePath: string): string => {
    return fs.readFileSync(filePath, "utf-8")
}
/**
 * collect all filepaths starting with dirPath that end in .sqf
 * @param dirPath
 * @returns string array of paths from dirPath (including dirPath)
 */
export const findAllsqfFiles = (dirPath: string): string[] => {
    return globSync(dirPath + '/**/*.sqf');
};