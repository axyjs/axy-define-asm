/// <reference path="../../typing/node.d.ts" />
"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require("fs");
var path = require("path");
var Writer = (function () {
    function Writer(context) {
        this.context = context;
    }
    Writer.prototype.write = function (shortname, content) {
    };
    Writer.prototype.flush = function () {
    };
    return Writer;
})();
exports.Writer = Writer;
var WriterFile = (function (_super) {
    __extends(WriterFile, _super);
    function WriterFile(context) {
        _super.call(this, context);
        this.context = context;
        this.content = [];
        if (context.options.outFile) {
            this.filename = context.options.outFile;
        }
        else {
            this.filename = context.options.source;
        }
    }
    WriterFile.prototype.write = function (shortname, content) {
        this.content.push(content);
    };
    WriterFile.prototype.flush = function () {
        fs.writeFileSync(this.filename, this.content.join("\n\n"), "utf-8");
    };
    return WriterFile;
})(Writer);
exports.WriterFile = WriterFile;
var WriterDir = (function (_super) {
    __extends(WriterDir, _super);
    function WriterDir(context) {
        _super.call(this, context);
        this.context = context;
        this.exists = {};
        if (context.options.outDir) {
            this.dirname = context.options.outDir;
            if (!fs.existsSync(this.dirname)) {
                try {
                    fs.mkdirSync(this.dirname);
                    this.context.out.log("Make dir " + this.dirname, 2);
                }
                catch (e) {
                    context.error("Can not create a directory " + this.dirname);
                }
            }
        }
        else {
            this.dirname = context.options.source;
        }
    }
    WriterDir.prototype.write = function (shortname, content) {
        var filename = this.dirname + shortname, context = this.context;
        context.counter.begin("Write " + shortname);
        this.createPath(shortname);
        fs.writeFile(filename, content, "utf-8", function (err) {
            context.counter.done("Write " + shortname);
            if (err) {
                context.error("Can not create a file " + filename);
            }
        });
    };
    WriterDir.prototype.createPath = function (shortname) {
        var dirname = path.dirname(shortname), full;
        if ((dirname === "/") || (dirname === ".") || (!dirname)) {
            return;
        }
        if (this.exists[dirname]) {
            return;
        }
        full = this.dirname + dirname;
        if (!fs.existsSync(full)) {
            this.createPath(dirname);
            try {
                fs.mkdirSync(full);
                this.context.out.log("Make dir " + dirname, 2);
            }
            catch (e) {
                this.context.error("Can not create a directory " + full);
            }
        }
    };
    return WriterDir;
})(Writer);
exports.WriterDir = WriterDir;
var WriterOut = (function (_super) {
    __extends(WriterOut, _super);
    function WriterOut(context) {
        _super.call(this, context);
        this.context = context;
    }
    WriterOut.prototype.write = function (shortname, content) {
        this.context.out.write(content + "\n\n");
    };
    return WriterOut;
})(Writer);
exports.WriterOut = WriterOut;
var WriterChain = (function (_super) {
    __extends(WriterChain, _super);
    function WriterChain() {
        _super.apply(this, arguments);
        this.children = [];
    }
    WriterChain.prototype.append = function (child) {
        this.children.push(child);
    };
    WriterChain.prototype.write = function (shortname, content) {
        this.children.forEach(function (child) {
            child.write(shortname, content);
        });
    };
    WriterChain.prototype.flush = function () {
        this.children.forEach(function (child) {
            child.flush();
        });
    };
    return WriterChain;
})(Writer);
exports.WriterChain = WriterChain;
function create(context) {
    var options = context.options, writer, writerOut, writerChain;
    if (options.outDir) {
        writer = new WriterDir(context);
    }
    else if (options.outFile) {
        writer = new WriterFile(context);
    }
    else if (options.outSelf) {
        if (!fs.existsSync(options.source)) {
            return null;
        }
        if (fs.statSync(options.source).isDirectory()) {
            writer = new WriterDir(context);
        }
        else {
            writer = new WriterFile(context);
        }
    }
    if (!options.out) {
        return writer;
    }
    writerOut = new WriterOut(context);
    if (!writer) {
        return writerOut;
    }
    writerChain = new WriterChain(context);
    writerChain.append(writer);
    writerChain.append(writerOut);
    return writerChain;
}
exports.create = create;
