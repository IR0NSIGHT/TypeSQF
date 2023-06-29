import { writeFile } from "../compile/writeFile";
import * as fs from "fs";

//TODO whats this for?
export const writeInitFile = (code: string, dir: string, fileName: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = dir != "." ? dir + "/" + fileName : fileName;
  return writeFile(code, filePath);
};
