import { Command } from "commander";
import { addSplitBlobAction } from "./CLI_Operations/splitBlobOperation";
import { addBuildCfgFunctionsAction } from "./CLI_Operations/buildCfgFunctionsFile";
const program = new Command();

program
  .name("tqf")
  .description("sqf-CLI for streamlining sqf developement")
  .version("1.0.0");

addSplitBlobAction(program);
addBuildCfgFunctionsAction(program);
program.parse();
