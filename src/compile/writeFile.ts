import * as fs from "fs";

export const writeFile = (code: string, path: string) => {
  fs.writeFile(path, code, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  return path;
};
