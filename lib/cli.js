/// <reference path="../node_modules/axy-cli-opts/index.d.ts" alias="axy-cli-opts" />
"use strict";
var api = require("./api");
var optionsCLI = require("./options/cli");
var opts = require("axy-cli-opts");
var domain = require("domain");
function runCLI(argv, done) {
    var options, d, result;
    try {
        opts.parse(argv, optionsCLI.format);
        options = (opts.parse(argv, optionsCLI.format).options);
    }
    catch (e) {
        console.log("Error: " + e.message);
        console.log("Format: axy-define-asm --source=[dir|file] <other options>");
        console.log("");
        console.log(opts.help(optionsCLI.format));
        if (done) {
            done();
        }
        return false;
    }
    d = domain.create();
    d.on("error", function (err) {
        if (options.error) {
            throw err;
        }
        else {
            console.log("Internal error");
            process.exit(1);
        }
    });
    d.run(function () {
        result = api.run(options, done);
    });
    return result;
}
exports.runCLI = runCLI;
