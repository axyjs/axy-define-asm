"use strict";
var optionsAPI = require("./options/api");
var contextMo = require("./context/index");
function run(options, done) {
    if (done === void 0) { done = null; }
    var context;
    options = optionsAPI.merge(options);
    try {
        context = new contextMo.Context(options, done);
        context.finder.run();
    }
    catch (e) {
        console.error(e.message);
        done();
        return false;
    }
    return true;
}
exports.run = run;
