"use strict";

import optionsAPI = require("./options/api");
import contextMo = require("./context/index");

export function run(options: optionsAPI.IOptions, done: Function = null): boolean {
    var context: contextMo.Context;
    options = optionsAPI.merge(options);
    try {
        context = new contextMo.Context(options, done);
        context.finder.run();
    } catch (e) {
        console.error(e.message);
        done();
        return false;
    }
    return true;
}
