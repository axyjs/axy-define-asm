"use strict";
var Logger = (function () {
    function Logger(level, prev) {
        if (level === void 0) { level = 0; }
        if (prev === void 0) { prev = null; }
        this.level = level;
        this.prev = prev;
        if (!prev) {
            this.prev = console.log;
        }
    }
    Logger.prototype.log = function (message, level) {
        if (level === void 0) { level = 1; }
        if (level <= this.level) {
            this.prev.call(null, message);
        }
    };
    Logger.prototype.error = function (message) {
        this.log(message);
    };
    return Logger;
})();
exports.Logger = Logger;
