irn_fnc_helloWorld = {
    diag_log "owo";
    if (true) then {
        owo;
    } else {
        uwu;
    }
};

/**
this is documentation for doSomething
*/
irn_fnc_doSomething = {
    // fixme doesnt carry over documentation
    _m = "this is a string";
    systemChat _m;
};
// FIXME ignores the last function if its missing a ";
" in the end