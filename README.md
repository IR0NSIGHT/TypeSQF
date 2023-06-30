# TypeSQF / TQF

sqf parser for QOL developement

## Description

this CLI Tool helps with preparing sqf functions.
core features are:

- generate cfgFunctions library from working directory
- generate working directory from blobfiles
- generate blobfiles/init.sqf from working directory

## What was it made for

Arma 3 SQF developement is notoriously annyoing.
If you keep the cfgFunctions library filestructure as your working filetree, you can not easily reload functions during runtime.
That requires a mission restart for every change.

Instead i opted for a different workflow, which i will briefly describe, because tqf was made to streamline that.

Blobfile >> executables >> cfgFunctions

### Blobfile

First stage is a single init.sqf file, that dynamically declares functions.
Good for quickly getting down some functionalities early.

```sqf
irn_fnc_helloWorld = {
    diag_log "Hello World";
};

/**
this is documentation for doSomething
*/
irn_fnc_doSomething = {
    _m = "this is a string";
    systemChat _m;
};
```

If i make adjustments during developement, i can simply reload the file.
I usually use the init.sqf to autoload on missionstart.

### single-function executables

Second stage is splitting all (global) functions into single files. tqf automates that.
now every function lives in a single, executable sqf file i can easily reload:

```sqf
//file: irn_fnc_helloWorld.sqf
irn_fnc_helloWorld = {
    diag_log "Hello World";
};
```

tqf can generate an init.sqf file that execVM`s all executabel function files, for easy reload-everything

### CfgFunctions library

Finally, if i want to export the functions into a mission or mod, tqf can compile the executables:

- generate a description.ext config file defining cfgFunctions (including compileflags like preinit etc)
- move all executables into pure sqf fnc files and the correct filetree:

```sqf
//file: functions/irn/fn_helloWorld.sqf
diag_log "Hello World";
```

## Usage

clone the repo  
install node.js from the internet  
navigate into the repository in bash  
globally install the module:

```bash
npm i -g # globally installs this npm module
```

module is now available as "typesqf":

```bash
$ typesqf
Usage: typesqf [options] [command]

sqf-CLI for streamlining sqf developement

Options:
  -V, --version                                           output the version number
  -h, --help                                              display help for command

Commands:
  split [options] <blobfile> [output directory]           Split a blobfile containing many function declarations into single-function-file executables.
  cfg <functions root> [output directory] [hpp filename]  Generate a cfg function .hpp file and function library for a working directory of functions.
  init <library root> [output directory] [filename]       Write an init file that execVMs and loads/reloads the functions dynamically during runtime
  help [command]                                          display help for command
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
