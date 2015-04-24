"use strict";

var optionsAPI = require("../lib/options/api.js");

module.exports = {

    testMerge: function (test) {
        var custom,
            actual;
        custom = {
            source: "this/file.txt",
            outDir: "that",
            appendVars: void 0,
            all: true
        };
        actual = optionsAPI.merge(custom);
        test.strictEqual(actual.source, "this/file.txt");
        test.strictEqual(actual.outDir, "that");
        test.strictEqual(actual.appendVars, void 0);
        test.strictEqual(actual.all, true);
        test.strictEqual(actual.out, true);
        test.strictEqual(actual.wrap, null);
        test.strictEqual(actual.define, "axy.define");
        test.done();
    }

};