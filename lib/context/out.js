"use strict";
var Out = (function () {
    function Out(level, sOut, sErr) {
        if (sOut === void 0) { sOut = process.stdout; }
        if (sErr === void 0) { sErr = process.stderr; }
        this.level = level;
        this.sOut = sOut;
        this.sErr = sErr;
    }
    Out.prototype.write = function (message) {
        this.sOut.write(message);
    };
    Out.prototype.log = function (message, level) {
        if (level === void 0) { level = 1; }
        if (level <= this.level) {
            this.write(message + "\n");
        }
    };
    Out.prototype.error = function (message) {
        this.sErr.write(message + "\n");
    };
    return Out;
})();
exports.Out = Out;
function create(options) {
    var level = options.verbose;
    if (!level) {
        level = 0;
    }
    else if (level === true) {
        level = 1;
    }
    return new Out(level);
}
exports.create = create;
