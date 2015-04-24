"use strict";
var Counter = (function () {
    function Counter(tDone, debug) {
        var _this = this;
        if (debug === void 0) { debug = false; }
        this.tDone = tDone;
        this.debug = debug;
        /* tslint:disable:typedef */
        this.done = function (message) {
            if (message === void 0) { message = null; }
            _this.count -= 1;
            if (_this.debug) {
                console.log("Done " + message + " [" + _this.count + "]");
            }
            if (_this.count !== 0) {
                return false;
            }
            if (typeof _this.tDone === "function") {
                _this.tDone.call(null);
            }
            return true;
        };
        /* tslint:enable:typedef */
        this.count = 0;
    }
    Counter.prototype.begin = function (message) {
        if (message === void 0) { message = null; }
        this.count += 1;
        if (this.debug) {
            console.log("Begin " + message + " [" + this.count + "]");
        }
    };
    return Counter;
})();
exports.Counter = Counter;
