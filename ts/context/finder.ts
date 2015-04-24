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

import contextMo = require("index");
import counterMo = require("counter");
import fs = require("fs");
import path = require("path");

export class Finder {
    constructor (private context: contextMo.Context) {
        this.source = this.context.options.source;
        this.counter = this.context.counter;
        this.root = this.context.options.root;
    }

    public run(): void {
        var stat: fs.Stats;
        if (!fs.existsSync(this.source)) {
            return this.context.error("Not found file or directory " + this.source);
        }
        stat = fs.statSync(this.source);
        if (stat.isFile()) {
            this.runFile();
        } else if (stat.isDirectory()) {
            this.runDirectory();
        } else {
            return this.context.error("Source " + this.source + " is not file or directory");
        }
    }

    private runFile(): void {
        this.processFile("/index" + path.extname(this.source), this.source);
    }

    private runDirectory(): void {
        var context: contextMo.Context = this.context,
            self: Finder = this;
        function dir(full: string, short: string): void {
            context.counter.begin("Dir " + short);
            fs.readdir(full, function (err: NodeJS.ErrnoException, files: string[]): void {
                if (err) {
                    context.counter.done();
                    context.error(err.message);
                } else {
                    files.forEach(function (file: string): void {
                        var fullname: string = full + "/" + file,
                            shortname: string = short + "/" + file;
                        context.counter.begin("File " + shortname);
                        fs.stat(fullname, function (err: NodeJS.ErrnoException, stat: fs.Stats): void {
                            if (err) {
                                context.counter.done("File " + shortname);
                                context.error(err.message);
                            } else if (stat.isFile()) {
                                if (self.filter(shortname, fullname, false)) {
                                    context.out.log(shortname, 1);
                                    self.processFile(shortname, fullname);
                                } else {
                                    context.out.log("Ignore file " + shortname, 2);
                                }
                                context.counter.done("File " + shortname);
                            } else {
                                if (self.filter(shortname, fullname, true)) {
                                    dir(fullname, shortname);
                                } else {
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
    }

    private processFile(shortname: string, fullname: string = null): void {
        var context: contextMo.Context = this.context,
            ext: string = path.extname(shortname).slice(1);
        if (!fullname) {
            fullname = this.source + "/" + shortname;
        }
        context.counter.begin("Process " + shortname);
        fs.readFile(fullname, "utf-8", function (err: NodeJS.ErrnoException, content: string): void {
            var wrapped: string;
            if (err) {
                context.counter.done("Process " + shortname);
                context.error(err.message);
            } else {
                wrapped = context.wrapper.wrap(content, shortname, ext);
                context.writer.write(shortname, wrapped);
                context.counter.done("Process " + shortname);
            }
        });
    }

    private filter(shortname: string, fullname: string, isDir: boolean): boolean {
        return this.context.filter.filter(shortname, isDir);
    }

    private source: string;

    private counter: counterMo.Counter;

    private root: string;
}
