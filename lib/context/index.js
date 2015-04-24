"use strict";
var check = require("./check");
var outMo = require("./out");
var counterMo = require("./counter");
var wrapperMo = require("./wrapper");
var finderMo = require("./finder");
var filterMo = require("./filter");
var writerMo = require("./writer");
var Context = (function () {
    function Context(options, gDone) {
        var _this = this;
        this.options = options;
        this.gDone = gDone;
        /* tslint:disable:typedef */
        this.done = function () {
            _this.writer.flush();
            if (typeof _this.gDone === "function") {
                _this.gDone.call(null);
            }
        };
        check(options);
        this.out = outMo.create(options);
        this.counter = new counterMo.Counter(this.done);
        this.wrapper = new wrapperMo.Wrapper(options);
        this.finder = new finderMo.Finder(this);
        this.filter = new filterMo.Filter(options);
        this.writer = writerMo.create(this);
    }
    Context.prototype.error = function (message) {
        if (message === void 0) { message = null; }
        throw new Error(message);
    };
    return Context;
})();
exports.Context = Context;
