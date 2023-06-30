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

# Developement

Its an npm project. package.json includes everything thats important.

