export const globalFunctionsRgx = /( |(\r\n)|^)([A-Za-z]+_)*(^fnc_|fnc_)\w+/; 

export const globalFncDef = new RegExp(globalFunctionsRgx.source +" += +{");

export const starCommentsRgx = new RegExp(/((\/\*.*)((\r\n)? *\*([^\/].*)?)*(\r\n)? *\*\/)|(\/\/.*)/);

export const functionBodyRgx = new RegExp(globalFncDef.source+".*((\r\n)+([^}].*)?)*\r\n};");
//FIXME cant handle functions that dont have }; but only }
//FIXME fails to regonize irn_fnc_owo =\r\n{
export const completeFunctionRgx = new RegExp("("+starCommentsRgx.source+")?"+functionBodyRgx.source);


//FIXME allow inputing a direcoty as blob src to extract all global function definitions