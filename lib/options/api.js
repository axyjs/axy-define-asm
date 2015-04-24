/**
 * Options for API
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
    pretty: false,
    allText: false,
    fixTS: false,
    filter: null,
    wrap: null
};
/**
 * Merges custom options with defaults
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
