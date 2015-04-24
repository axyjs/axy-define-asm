"use strict";

import optionsAPI = require("../options/api");

export interface IStream {
    write: (message: string) => void;
}

interface IProcess {
    stdout: IStream;
    stderr: IStream;
}

declare var process: IProcess;

export class Out {
    constructor(private level: number, private sOut: IStream = process.stdout, private sErr: IStream = process.stderr) {
    }

    write(message: string): void {
        this.sOut.write(message);
    }

    log(message: string, level: number = 1): void {
        if (level <= this.level) {
            this.write(message + "\n");
        }
    }

    error(message: string): void {
        this.sErr.write(message + "\n");
    }
}

export function create(options: optionsAPI.IOptions): Out {
    var level: number|boolean = options.verbose;
    if (!level) {
        level = 0;
    } else if (level === true) {
        level = 1;
    }
    return new Out(<number>level);
}
