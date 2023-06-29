import { Command } from "commander";
import { performSplit } from "../CLI_Operations/splitBlobOperation";

const program = new Command();

program
  .name("tqf")
  .description("sqf-CLI for streamlining sqf developement")
  .version("1.0.0");

program
  .command("split")
  .description(
    "Split a blobfile containing many function declarations into single-function-file executables."
  )
  .argument("<blobfile>", "input path of blobfile")
  .argument("[output directory]", "directory to write function files to", ".")
  .option("--init", "init the functions from the blobfile")
  .option("--remove", "remove the parsed functions from the blobfile")
  .action(
    (
      inPath: string,
      targetDir: string,
      options: { init: boolean | undefined; remove: boolean | undefined }
    ) => {
      //  const initFlag = options.init ? true : false;
      const removeFlag = options.remove ? true : false;

      console.log(
        "perform split on file ",
        inPath,
        " towards dir ",
        targetDir,
        " with deletion:",
        removeFlag
      );
      performSplit(inPath, targetDir, removeFlag);
    }
  );

program.parse();
