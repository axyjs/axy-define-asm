/**
 * Options for API
 */
"use strict";

/**
 * The list of assembly options
 * Description see below for `cli`
 */
export interface IOptions {
    source: string;
    outDir?: string;
    outFile?: string;
    outSelf?: boolean;
    out?: boolean;
    root?: string;
    define?: string;
    appendVars?: string;
    globalWrapper?: boolean;
    addExt?: string[];
    all?: boolean;
    ignoreExt?: string[];
    ignoreFile?: string[];
    ignoreDir?: string[];
    sourceMap?: boolean;
    verbose?: number|boolean;
    useStrict?: boolean;
    utime?: boolean;
    error?: boolean;
    pretty?: boolean;
    allText?: boolean;
    fixTS?: boolean;
    filter?: IFileFilter;
    wrap?: IWrap;
}

/**
 * The files filter
 */
export interface IFileFilter {
    /**
     * Checks that the file should be processed
     *
     * For example source dir is /source/dir and file is /source/dir/folder/file.js
     *
     * @param {string} filename
     *        the relative path ot the file (folder/file.js)
     * @param {string} basename
     *        the base name (file.js)
     * @param {string} ext
     *        the file extensions (js)
     * @param {boolean} isDir
     *        the file is a directory (process the contents)
     * @param {object} options
     *        the global options of the process
     * @return {boolean}
     *         TRUE for process, FALSE for ignore
     */
    (filename: string, basename: string, ext: string, isDir: boolean, options: IOptions): boolean;
}

/**
 * The wrapper
 */
export interface IWrap {
    /**
     * @param {string} content
     *        the content of a file
     * @param {string} filename
     *        the relative path
     * @param {string} ext
     *        the extensions
     * @param options
     *        the global options of the process
     * @return {string}
     */
    (content: string, filename: string, ext: string, options: IOptions): string
}

/**
 * Default values of the options
 */
export var defaults: IOptions = {
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
export function merge(custom: IOptions): IOptions {
    var result: IOptions = <IOptions>{},
        k: string;
    for (k in defaults) {
        if (defaults.hasOwnProperty(k)) {
            if (custom.hasOwnProperty(k)) {
                result[k] = custom[k];
            } else {
                result[k] = defaults[k];
            }
        }
    }
    return result;
}
