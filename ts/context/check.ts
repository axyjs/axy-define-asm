"use strict";

import optionsAPI = require("../options/api");

function check(options: optionsAPI.IOptions): void {
    var outO: string;
    if (!options.source) {
        throw new Error("Required option --source (-s)");
    }
    ["outDir", "outFile", "outSelf"].forEach(function (opt: string): void {
        if (options[opt]) {
            if (outO) {
                throw new Error("Options --" + outO + " and --" + opt + " can not be used together");
            }
            outO = opt;
        }
    });
    if (options.out) {
        if (options.verbose) {
            throw new Error("Options --out and --verbose can not be used together");
        }
    } else if (!outO) {
        throw new Error("Required one of the options --out*");
    }
}

export = check;
