/// <reference path="../../typing/node.d.ts" />
"use strict";

import optionsAPI = require("../options/api");
import path = require("path");

export class Filter {
    constructor(private options: optionsAPI.IOptions) {
        var self: Filter = this;
        if (typeof options.filter === "function") {
            this.custom = options.filter;
        }
        options.addExt.forEach(function (item: string): void {
            self.exts[item] = true;
        });
        if (options.all) {
            this.all = true;
        }
        options.ignoreDir.forEach(function (item: string): void {
            self.ignoredDirs[item] = true;
        });
        options.ignoreFile.forEach(function (item: string): void {
            self.ignoredFiles[item] = true;
        });
        options.ignoreExt.forEach(function (item: string): void {
            self.exts[item] = false;
        });
    }

    filter(filename: string, isDir: boolean): boolean {
        var options: optionsAPI.IOptions = this.options,
            basename: string,
            ext: string,
            lExt: boolean;
        if (isDir) {
            if (this.ignoredDirs[filename]) {
                return false;
            }
        } else {
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
    }

    private custom: optionsAPI.IFileFilter;

    private exts: any = {js: true, json: true, map: false};

    private all: boolean = false;

    private ignoredFiles: any = {};

    private ignoredDirs: any = {};
}
