"use strict";

var out = require("../lib/context/out.js"),
    check  = require("../lib/context/check.js"),
    Wrapper = require("../lib/context/wrapper.js").Wrapper,
    optionsAPI = require("../lib/options/api.js"),
    Counter = require("../lib/context/counter").Counter;

module.exports = {
    testOut: function (test) {
        var sOut,
            sErr,
            logger;
        function CustomOut() {
            this.content = "";
        }
        CustomOut.prototype.write = function (message) {
            this.content += message;
        };
        sOut = new CustomOut();
        sErr = new CustomOut();
        logger = new out.Out(2, sOut, sErr);
        logger.write("One");
        logger.log("Two");
        logger.error("Three");
        logger.write("Four");
        logger.log("Five", 2);
        logger.error("Six");
        logger.write("Eight");
        logger.log("Nine", 3);
        logger.error("Ten");
        test.strictEqual(sOut.content, "OneTwo\nFourFive\nEight");
        test.strictEqual(sErr.content, "Three\nSix\nTen\n");
        test.done();
    },

    testCheck: function (test) {
        test.throws(function () {
            check({});
        });
        test.throws(function () {
            check({
                source: "/path/to/dir"
            });
        });
        test.throws(function () {
            check({
                source: "/path/to/dir",
                outDir: "/path/to/out",
                outFile: "/path/to/file"
            });
        });
        test.throws(function () {
            check({
                source: "/path/to/dir",
                outDir: "/path/to/out",
                outSelf: true
            });
        });
        test.throws(function () {
            check({
                source: "/path/to/dir",
                outFile: "/path/to/out",
                outSelf: true
            });
        });
        test.doesNotThrow(function () {
            check({
                source: "/path/to/dir",
                out: true
            });
        });
        test.doesNotThrow(function () {
            check({
                source: "/path/to/dir",
                outDir: "/path/to/dir",
                out: true
            });
        });
        test.doesNotThrow(function () {
            check({
                source: "/path/to/dir",
                outDir: "/path/to/dir",
                verbose: true
            });
        });
        test.throws(function () {
            check({
                source: "/path/to/dir",
                outDir: "/path/to/dir",
                out: true,
                verbose: true
            });
        });
        test.done();
    },

    testWrapperStandard: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'axy.define("/sum.js", function (exports, require, module, __filename, __dirname, global, process) {',
            'module.exports = 2;',
            '});'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperGlobalWrapper: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({globalWrapper: true})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'axy.define("/sum.js", function (exports, require, module, __filename, __dirname, global, process) ' +
                '{ (function (exports, require, module, __filename, __dirname) {',
            'module.exports = 2;',
            '})(exports, require, module, __filename, __dirname); });'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperAppendVars: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({globalWrapper: true, appendVars: "a, b"})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'axy.define("/sum.js", function (exports, require, module, __filename, __dirname, a, b) { ' +
                '(function (exports, require, module, __filename, __dirname) {',
            'module.exports = 2;',
            '})(exports, require, module, __filename, __dirname); });'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperAppendVarsNo: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({globalWrapper: true, appendVars: ""})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'axy.define("/sum.js", function (exports, require, module, __filename, __dirname) {',
            'module.exports = 2;',
            '});'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperDefine: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({define: "mydef"})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'mydef("/sum.js", function (exports, require, module, __filename, __dirname, global, process) {',
            'module.exports = 2;',
            '});'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperUseStrict: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({useStrict: true})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'axy.define("/sum.js", function (exports, require, module, __filename, __dirname, global, process) { ' +
                '"use strict";',
            'module.exports = 2;',
            '});'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperPrettyGlobal: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({globalWrapper: true, useStrict: true, pretty: true})),
            actual,
            expected;
        actual = wrapper.wrap("module.exports = 2;", "/sum.js", "js");
        expected = [
            'axy.define("/sum.js", function (exports, require, module, __filename, __dirname, global, process) {',
            '    "use strict";',
            '    (function (exports, require, module, __filename, __dirname) {',
            '        module.exports = 2;',
            '    })(exports, require, module, __filename, __dirname);',
            '});'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperJSON: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({})),
            actual,
            expected;
        actual = wrapper.wrap("[1, 2, 3]", "/data.json", "json");
        expected = [
            'axy.define("/data.json", [1, 2, 3]);'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperJSONString: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({})),
            actual,
            expected;
        actual = wrapper.wrap('"[1, 2, 3]"', "/data.json", "json");
        expected = [
            'axy.define("/data.json", (function () {return "[1, 2, 3]";}));'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperText: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({})),
            actual,
            expected;
        actual = wrapper.wrap('This is text', "/data.txt", "txt");
        expected = [
            'axy.define("/data.txt", "This is text");'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperWrap: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({wrap: function (content, filename, ext) {
                if (ext === "txt") {
                    return '"' + content + filename + '"';
                }
            }})),
            actual,
            expected;
        actual = wrapper.wrap("This is text", "/txt.txt", "txt");
        expected = [
            'axy.define("/txt.txt", "This is text/txt.txt");'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testWrapperWrapPass: function (test) {
        var wrapper = new Wrapper(optionsAPI.merge({wrap: function (content, filename, ext) {
                if (ext === "txt") {
                    return '"' + content + filename + '"';
                }
            }, x: 10})),
            actual,
            expected;
        actual = wrapper.wrap('This is h\nt"ml', '/txt.html', "html");
        expected = [
            'axy.define("/txt.html", "This is h\\nt\\\"ml");'
        ];
        test.strictEqual(actual, expected.join("\n"));
        test.done();
    },

    testCounter: function (test) {
        var x = false,
            counter,
            done,
            cDone;
        done = function () {
            x  = true;
        };
        counter = new Counter(done);
        cDone = counter.done;
        counter.begin();
        counter.begin();
        test.ok(!cDone());
        counter.begin();
        test.ok(!cDone());
        test.ok(!x);
        test.ok(cDone());
        test.ok(x);
        test.done();
    }
};