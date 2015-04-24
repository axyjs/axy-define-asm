/// <reference path="../node_modules/axy-cli-opts/index.d.ts" alias="axy-cli-opts" />
"use strict";

import api = require("./api");
import optionsAPI = require("./options/api");
import optionsCLI = require("./options/cli");
import opts = require("axy-cli-opts");
import domain = require("domain");

export function runCLI(argv: string[], done: Function): boolean {
    var options: optionsAPI.IOptions,
        d: domain.Domain,
        result: boolean;
    try {
        opts.parse(argv, optionsCLI.format);
        options = <optionsAPI.IOptions>((<opts.IResult>opts.parse(argv, optionsCLI.format)).options);
    } catch (e) {
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
    d.on("error", function (err: Error): void {
        if (options.error) {
            throw err;
        } else {
            console.log("Internal error");
            process.exit(1);
        }
    });
    d.run(function (): void {
        result = api.run(options, done);
    });
    return result;
}
