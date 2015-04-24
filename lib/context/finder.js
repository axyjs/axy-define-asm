/**
 * Finds source files, transmits them to the wrapper and to the writer
 *
 * Options that affect search:
 * - addExt
 * - all
 * - ignoreDir
 * - ignoreExt
 * - ignoreFile
 *
 * Additionally
 * - verbose - for log
 */
/// <reference path="../../typing/node.d.ts" />
"use strict";
var fs = require("fs");
var path = require("path");
var Finder = (function () {
    function Finder(context) {
        this.context = context;
        this.source = this.context.options.source;
        this.counter = this.context.counter;
        this.root = this.context.options.root;
    }
    Finder.prototype.run = function () {
        var stat;
        if (!fs.existsSync(this.source)) {
            return this.context.error("Not found file or directory " + this.source);
        }
        stat = fs.statSync(this.source);
        if (stat.isFile()) {
            this.runFile();
        }
        else if (stat.isDirectory()) {
            this.runDirectory();
        }
        else {
            return this.context.error("Source " + this.source + " is not file or directory");
        }
    };
    Finder.prototype.runFile = function () {
        this.processFile("/index" + path.extname(this.source), this.source);
    };
    Finder.prototype.runDirectory = function () {
        var context = this.context, self = this;
        function dir(full, short) {
            context.counter.begin("Dir " + short);
            fs.readdir(full, function (err, files) {
                if (err) {
                    context.counter.done();
                    context.error(err.message);
                }
                else {
                    files.forEach(function (file) {
                        var fullname = full + "/" + file, shortname = short + "/" + file;
                        context.counter.begin("File " + shortname);
                        fs.stat(fullname, function (err, stat) {
                            if (err) {
                                context.counter.done("File " + shortname);
                                context.error(err.message);
                            }
                            else if (stat.isFile()) {
                                if (self.filter(shortname, fullname, false)) {
                                    context.out.log(shortname, 1);
                                    self.processFile(shortname, fullname);
                                }
                                else {
                                    context.out.log("Ignore file " + shortname, 2);
                                }
                                context.counter.done("File " + shortname);
                            }
                            else {
                                if (self.filter(shortname, fullname, true)) {
                                    dir(fullname, shortname);
                                }
                                else {
                                    context.out.log("Ignore directory " + shortname, 2);
                                }
                                context.counter.done("File " + shortname);
                            }
                        });
                    });
                    context.counter.done("Dir " + short);
                }
            });
        }
        dir(this.source, "");
    };
    Finder.prototype.processFile = function (shortname, fullname) {
        if (fullname === void 0) { fullname = null; }
        var context = this.context, ext = path.extname(shortname).slice(1);
        if (!fullname) {
            fullname = this.source + "/" + shortname;
        }
        context.counter.begin("Process " + shortname);
        fs.readFile(fullname, "utf-8", function (err, content) {
            var wrapped;
            if (err) {
                context.counter.done("Process " + shortname);
                context.error(err.message);
            }
            else {
                wrapped = context.wrapper.wrap(content, shortname, ext);
                context.writer.write(shortname, wrapped);
                context.counter.done("Process " + shortname);
            }
        });
    };
    Finder.prototype.filter = function (shortname, fullname, isDir) {
        return this.context.filter.filter(shortname, isDir);
    };
    return Finder;
})();
exports.Finder = Finder;
