"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dest = (function () {
    function Dest(context) {
        this.context = context;
    }
    Dest.prototype.flush = function () {
    };
    return Dest;
})();
exports.Dest = Dest;
var DestDir = (function (_super) {
    __extends(DestDir, _super);
    function DestDir() {
        _super.apply(this, arguments);
    }
    return DestDir;
})(Dest);
exports.DestDir = DestDir;
var DestFile = (function (_super) {
    __extends(DestFile, _super);
    function DestFile() {
        _super.apply(this, arguments);
    }
    return DestFile;
})(Dest);
exports.DestFile = DestFile;
var DestOut = (function (_super) {
    __extends(DestOut, _super);
    function DestOut() {
        _super.apply(this, arguments);
    }
    return DestOut;
})(Dest);
exports.DestOut = DestOut;
function create(context) {
    return null;
}
exports.create = create;
