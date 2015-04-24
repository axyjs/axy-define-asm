/**
 * Assembly options
 */
"use strict";
/**
 * Default values of the options
 */
exports.defaults = {
    source: null,
    outDir: null,
    outSelf: false,
    outFile: null,
    out: true,
    root: "/",
    define: "axy.define",
    appendVars: "global, process",
    globalWrapper: false,
    addExt: [],
    all: false,
    ignoreExt: [],
    ignoreFile: [],
    ignoreDir: [],
    sourceMap: false,
    verbose: false,
    useStrict: false,
    utime: false,
    error: false,
    filter: null,
    wrap: null
};
/**
 * Merges custom options and defaults
 *
 * @param {object} custom
 * @return {object}
 */
function merge(custom) {
    var result = {}, k;
    for (k in exports.defaults) {
        if (exports.defaults.hasOwnProperty(k)) {
            if (custom.hasOwnProperty(k)) {
                result[k] = custom[k];
            }
            else {
                result[k] = exports.defaults[k];
            }
        }
    }
    return result;
}
exports.merge = merge;
/**
 * The format of command line options
 * @see axy-cli-opts
 */
exports.cliFormat = {
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
        defaults: "process, global",
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
        description: "Verbose level (1, 2), silence by default",
        descriptionVal: "level"
    },
    useStrict: {
        short: "u",
        flag: true,
        description: "Add 'use strict'"
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
    }
};
