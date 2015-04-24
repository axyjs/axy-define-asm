/**
 * Wraps the content of a file
 *
 * Options that affect wrap:
 * - appendVars
 * - define
 * - globalWrapper
 * - pretty
 * - root
 * - useStrict
 * - allText
 * - fixTS
 */
"use strict";

import optionsAPI = require("../options/api");

export class Wrapper {
    constructor (private options: optionsAPI.IOptions) {
    }

    public wrap (content: string, filename: string, ext: string): string {
        var iWrapper: string,
            fn: string;
        if (this.options.wrap) {
            iWrapper = this.options.wrap.call(null, content, filename, ext, this.options);
        }
        if (typeof iWrapper !== "string") {
            iWrapper = this.w(content, ext);
        }
        fn = filename;
        if (this.options.root !== "/") {
            fn = this.options.root + fn;
        }
        return this.options.define + "(\"" + fn + "\", " + iWrapper + ");";
    }

    private w(content: string, ext: string): string {
        if (!this.options.allText) {
            if (ext === "js") {
                return this.wJS(content);
            } else if (ext === "json") {
                return this.wJSON(content);
            }
        } else if (ext === "js") {
            content = this.processCode(content);
        }
        return this.wOther(content);
    }

    private wJS(content: string): string {
        var top: string[] = [],
            bottom: string[] = [],
            topS: string,
            bottomS: string,
            vars: string = "exports, require, module, __filename, __dirname",
            pretty: boolean = this.options.pretty,
            indent: string = "",
            append: string = this.options.appendVars;
        if (append) {
            append = ", " + append;
        }
        top.push("function (" + vars + append + ") {");
        bottom.push("}");
        if (pretty) {
            indent = "    ";
        }
        if (this.options.useStrict) {
            top.push(indent + "\"use strict\";");
        }
        if (this.options.globalWrapper && append) {
            top.push(indent + "(function (" + vars + ") {");
            bottom.push(indent + "})(" + vars + ");");
            if (pretty) {
                indent += "    ";
            }
        }
        bottom = bottom.reverse();
        content = this.processCode(content);
        if (pretty) {
            topS = top.join("\n");
            bottomS = bottom.join("\n");
            content = indent + content.replace(/\n/g, "\n" + indent).replace(/\s+$/, "");
        } else {
            topS = top.join(" ");
            bottomS = bottom.join(" ");
        }
        return topS + "\n" + content + "\n" + bottomS;
    }

    private wJSON(content: string): string {
        if (content.charAt(0) === "\"") {
            return "(function () {return " + content + ";})";
        }
        return content;
    }

    private wOther(content: string): string {
        return "\"" + content.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\n/g, "\\n") + "\"";
    }

    private processCode(content: string): string {
        if (content.slice(0, 2) === "#!") {
            content = content.replace(/^.*?\n/, "");
        }
        content = this.fixTS(content);
        return content;
    }

    private fixTS(content: string): string {
        if (this.options.fixTS) {
            content = content.replace(/this\.__extends \|\|/g, "(this && this.__extends) ||");
        }
        return content;
    }
}
