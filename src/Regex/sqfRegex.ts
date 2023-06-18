export const globalFunctionsRgx = /( |(\r\n)|^)([A-Za-z]+_)*(^fnc_|fnc_)\w+/; 

export const globalFncDef = new RegExp(globalFunctionsRgx.source +" += +{");

export const starCommentsRgx = new RegExp(/((\/\*.*)((\r\n)? *\*([^\/].*)?)*(\r\n)? *\*\/)|(\/\/.*)/);

export const functionBodyRgx = new RegExp(globalFncDef.source+".*((\r\n)+([^}].*)?)*\r\n};");



export const completeFunctionRgx = new RegExp("("+starCommentsRgx.source+")?"+functionBodyRgx.source);


