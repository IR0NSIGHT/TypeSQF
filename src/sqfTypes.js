"use strict";
exports.__esModule = true;
exports.isSqfFunction = exports.hasFilePath = void 0;
function hasFilePath(fnc) {
    return fnc.filePath !== null;
}
exports.hasFilePath = hasFilePath;
function isSqfFunction(fnc) {
    return fnc !== null;
}
exports.isSqfFunction = isSqfFunction;
