import { Command } from "commander";
import { addSplitBlobAction } from "./CLI_Operations/splitBlobOperation";
import { addBuildCfgFunctionsAction } from "./CLI_Operations/buildCfgFunctionsFile";
import { addWriteInitAction } from "./CLI_Operations/writeInitFile";
const program = new Command();

program
  .name("typesqf")
  .description("sqf-CLI for streamlining sqf developement")
  .version("1.0.0");

addSplitBlobAction(program);
addBuildCfgFunctionsAction(program);
addWriteInitAction(program);
program.parse();
