/// <reference path="../../typing/node.d.ts" />
"use strict";
var path = require("path");
var Filter = (function () {
    function Filter(options) {
        this.options = options;
        this.exts = { js: true, json: true, map: false };
        this.all = false;
        this.ignoredFiles = {};
        this.ignoredDirs = {};
        var self = this;
        if (typeof options.filter === "function") {
            this.custom = options.filter;
        }
        options.addExt.forEach(function (item) {
            self.exts[item] = true;
        });
        if (options.all) {
            this.all = true;
        }
        options.ignoreDir.forEach(function (item) {
            self.ignoredDirs[item] = true;
        });
        options.ignoreFile.forEach(function (item) {
            self.ignoredFiles[item] = true;
        });
        options.ignoreExt.forEach(function (item) {
            self.exts[item] = false;
        });
    }
    Filter.prototype.filter = function (filename, isDir) {
        var options = this.options, basename, ext, lExt;
        if (isDir) {
            if (this.ignoredDirs[filename]) {
                return false;
            }
        }
        else {
            ext = path.extname(filename).slice(1);
            lExt = this.exts[ext];
            if ((lExt === false) || ((lExt !== true) && (!this.all))) {
                return false;
            }
            if (this.ignoredFiles[filename]) {
                return false;
            }
        }
        if (this.custom) {
            basename = path.basename(filename);
            return this.custom.call(null, filename, basename, ext, isDir, options);
        }
        return true;
    };
    return Filter;
})();
exports.Filter = Filter;
