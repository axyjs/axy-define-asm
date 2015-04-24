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
var Wrapper = (function () {
    function Wrapper(options) {
        this.options = options;
    }
    Wrapper.prototype.wrap = function (content, filename, ext) {
        var iWrapper, fn;
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
    };
    Wrapper.prototype.w = function (content, ext) {
        if (!this.options.allText) {
            if (ext === "js") {
                return this.wJS(content);
            }
            else if (ext === "json") {
                return this.wJSON(content);
            }
        }
        else if (ext === "js") {
            content = this.processCode(content);
        }
        return this.wOther(content);
    };
    Wrapper.prototype.wJS = function (content) {
        var top = [], bottom = [], topS, bottomS, vars = "exports, require, module, __filename, __dirname", pretty = this.options.pretty, indent = "", append = this.options.appendVars;
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
        }
        else {
            topS = top.join(" ");
            bottomS = bottom.join(" ");
        }
        return topS + "\n" + content + "\n" + bottomS;
    };
    Wrapper.prototype.wJSON = function (content) {
        if (content.charAt(0) === "\"") {
            return "(function () {return " + content + ";})";
        }
        return content;
    };
    Wrapper.prototype.wOther = function (content) {
        return "\"" + content.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\n/g, "\\n") + "\"";
    };
    Wrapper.prototype.processCode = function (content) {
        if (content.slice(0, 2) === "#!") {
            content = content.replace(/^.*?\n/, "");
        }
        content = this.fixTS(content);
        return content;
    };
    Wrapper.prototype.fixTS = function (content) {
        if (this.options.fixTS) {
            content = content.replace(/this\.__extends \|\|/g, "(this && this.__extends) ||");
        }
        return content;
    };
    return Wrapper;
})();
exports.Wrapper = Wrapper;
