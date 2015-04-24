/**
 * Command line options format
 */
/// <reference path="../../node_modules/axy-cli-opts/index.d.ts" alias="axy-cli-opts" />
"use strict";

import opts = require("axy-cli-opts");

/**
 * The format of command line options
 * @see axy-cli-opts
 */
export var format: opts.IFormat = {

    source: {
        short: "s",
        description: "Source file or directory",
        descriptionVal: "dir|file"
    },

    outDir: {
        defaults: null,
        description: "Output directory (follow the structure of source)",
        descriptionVal: "dir"
    },

    outFile: {
        defaults: null,
        description: "Assemble to a single file",
        descriptionVal: "file"
    },

    outSelf: {
        flag: true,
        description: "Rewrite source file(s)"
    },

    out: {
        short: "o",
        flag: true,
        description: "Output to stdout"
    },

    root: {
        short: "r",
        description: "Root directory",
        descriptionVal: "dir",
        defaults: "/"
    },

    define: {
        short: "d",
        defaults: "axy.define",
        description: "Name of define function (axy.define by default)",
        descriptionVal: "prefix"
    },

    appendVars: {
        defaults: "global, process",
        description: "Append vars to the wrapper (by default 'process, global')",
        descriptionVal: "vars"
    },

    globalWrapper: {
        flag: true,
        description: "Top wrapper for appendVars"
    },

    addExt: {
        many: true,
        defaults: [],
        description: "Add an extension to assembly",
        descriptionVal: "ext"
    },

    all: {
        short: "a",
        flag: true,
        description: "Add all files"
    },

    ignoreExt: {
        many: true,
        defaults: [],
        description: "Ignore an extension",
        descriptionVal: "ext"
    },

    ignoreFile: {
        many: true,
        defaults: [],
        description: "Ignore a file",
        descriptionVal: "file"
    },

    ignoreDir: {
        many: true,
        defaults: [],
        description: "Ignore a dir",
        descriptionVal: "dir"
    },

    sourceMap: {
        flag: true,
        description: "Changing the source map"
    },

    verbose: {
        flag: true,
        type: "id",
        mixed: true,
        description: "Verbose level (1, 2), silence by default",
        descriptionVal: "level"
    },

    useStrict: {
        short: "u",
        flag: true,
        description: "Add 'use strict'"
    },

    pretty: {
        short: "p",
        flag: true,
        description: "Formatted output"
    },

    utime: {
        short: "t",
        flag: true,
        description: "Check update time of destination files"
    },

    error: {
        short: "e",
        flag: true,
        description: "Show information about errors"
    },

    allText: {
        flag: true,
        description: "Process all files as text"
    },

    fixTS: {
        flag: true,
        description: "Fix TypeScript artifacts"
    }
};
