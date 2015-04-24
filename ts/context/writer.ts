/// <reference path="../../typing/node.d.ts" />
"use strict";

import fs = require("fs");
import path = require("path");
import optionsAPI = require("../options/api");
import contextMo = require("index");

export class Writer {

    constructor(protected context: contextMo.Context) {
    }

    write(shortname: string, content: string): void {
    }

    flush(): void {
    }

}

export class WriterFile extends Writer {

    constructor(protected context: contextMo.Context) {
        super(context);
        if (context.options.outFile) {
            this.filename = context.options.outFile;
        } else {
            this.filename = context.options.source;
        }
    }

    write(shortname: string, content: string): void {
        this.content.push(content);
    }

    flush(): void {
        fs.writeFileSync(this.filename, this.content.join("\n\n"), "utf-8");
    }

    private filename: string;

    private content: string[] = [];
}

export class WriterDir extends Writer {

    constructor(protected context: contextMo.Context) {
        super(context);
        if (context.options.outDir) {
            this.dirname = context.options.outDir;
            if (!fs.existsSync(this.dirname)) {
                try {
                    fs.mkdirSync(this.dirname);
                    this.context.out.log("Make dir " + this.dirname, 2);
                } catch (e) {
                    context.error("Can not create a directory " + this.dirname);
                }
            }
        } else {
            this.dirname = context.options.source;
        }
    }

    write(shortname: string, content: string): void {
        var filename: string = this.dirname + shortname,
            context: contextMo.Context = this.context;
        context.counter.begin("Write " + shortname);
        this.createPath(shortname);
        fs.writeFile(filename, content, "utf-8", function (err: NodeJS.ErrnoException): void {
            context.counter.done("Write " + shortname);
            if (err) {
                context.error("Can not create a file " + filename);
            }
        });
    }

    private createPath(shortname: string): void {
        var dirname: string = path.dirname(shortname),
            full: string;
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
            } catch (e) {
                this.context.error("Can not create a directory " + full);
            }
        }
    }

    private dirname: string;

    private exists: any = {};
}

export class WriterOut extends Writer {
    constructor(protected context: contextMo.Context) {
        super(context);
    }

    write(shortname: string, content: string): void {
        this.context.out.write(content + "\n\n");
    }
}

export class WriterChain extends Writer {

    append(child: Writer): void {
        this.children.push(child);
    }

    write(shortname: string, content: string): void {
        this.children.forEach(function (child: Writer): void {
            child.write(shortname, content);
        });
    }

    flush(): void {
        this.children.forEach(function (child: Writer): void {
            child.flush();
        });
    }

    private children: Writer[] = [];

}

export function create(context: contextMo.Context): Writer {
    var options: optionsAPI.IOptions = context.options,
        writer: Writer,
        writerOut: WriterOut,
        writerChain: WriterChain;
    if (options.outDir) {
        writer = new WriterDir(context);
    } else if (options.outFile) {
        writer = new WriterFile(context);
    } else if (options.outSelf) {
        if (!fs.existsSync(options.source)) {
            return null;
        }
        if (fs.statSync(options.source).isDirectory()) {
            writer = new WriterDir(context);
        } else {
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
