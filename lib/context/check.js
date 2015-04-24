"use strict";
function check(options) {
    var outO;
    if (!options.source) {
        throw new Error("Required option --source (-s)");
    }
    ["outDir", "outFile", "outSelf"].forEach(function (opt) {
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
    }
    else if (!outO) {
        throw new Error("Required one of the options --out*");
    }
}
module.exports = check;
