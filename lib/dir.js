"use strict";
function nativeReaddir(dir) {
    var files = [], dirs = [], result = { files: files, dirs: dirs }, fs = require("fs");
    fs.readdirSync(dir).forEach(function (item) {
        if (fs.statSync(dir + "/" + item).isDirectory()) {
            dirs.push(item);
        }
        else {
            files.push(item);
        }
    });
    return result;
}
exports.nativeReaddir = nativeReaddir;
function read(dir, context) {
    if (!context.result) {
        context.result = [];
    }
    if (context.readdir) {
        context.readdir = nativeReaddir;
    }
    return context.result;
}
exports.read = read;
