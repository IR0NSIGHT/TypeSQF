# TypeSQF

sqf parser for QOL developement

# TODO

refine CLI:

- define input: blobfile, executables, cfgfunctions directory
- define output: blobfile, executables + init, cfgFunctions directory
- consider this the proper working directory: ?
  irn
  ---medical
  ------autodoc.sqf: "diag_log 'hello world';"

# End User Usage

this program helps with preparing sqf functions.
core features are:
- generate cfgFunctions from working directory
- generate working directory from blobfiles
- generate blobfiles/init.sqf from working directory

it considers this layout the default strucutre of a project:
- each function resides in its own file
- the file is named exactly like the function
- the file is an executalbe sqf file, running it defines the function:
    ```sqf
        irn_fnc_owo = { diag_log "hello world" };
    ```

from this default structure more things can be generated/compiled:
- a functions library using CfgFunctions for missions and mods
- a blob file that includes all functions into a single init for noob-friendly usage in missions/sharing
- an init file that loads all files with execVM for quickly reloading during developement 

the default structure can be generated from a blobfile

using the CLI tool:
node index.js 

flags:
-f cfgFunctions: will use split functions and prepare a .hpp file for use in cfgFunctions.
-e executable: will prepare sqf code that loads all function files via execVM for easy reloading during developement.
-s split: will read in a blob file and split it into single-function-files for all global function declarations.
-j join: will produce a blob file from many single-function-files.
-in directory: input directory to use for operations
-out directory: out directory to use for operations

# Developement

Its an npm project.
