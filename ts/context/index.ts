"use strict";

import optionsAPI = require("../options/api");
import check = require("./check");
import outMo = require("./out");
import counterMo = require("./counter");
import wrapperMo = require("./wrapper");
import finderMo = require("./finder");
import filterMo = require("./filter");
import writerMo = require("./writer");

export class Context {
    constructor(public options: optionsAPI.IOptions, private gDone: Function) {
        check(options);
        this.out = outMo.create(options);
        this.counter = new counterMo.Counter(this.done);
        this.wrapper = new wrapperMo.Wrapper(options);
        this.finder = new finderMo.Finder(this);
        this.filter = new filterMo.Filter(options);
        this.writer = writerMo.create(this);
    }

    public error(message: string = null): void {
        throw new Error(message);
    }

    public out: outMo.Out;
    public counter: counterMo.Counter;
    public wrapper: wrapperMo.Wrapper;
    public finder: finderMo.Finder;
    public filter: filterMo.Filter;
    public writer: writerMo.Writer;

    /* tslint:disable:typedef */
    private done = (): void => {
        this.writer.flush();
        if (typeof this.gDone === "function") {
            this.gDone.call(null);
        }
    };
    /* tslint:enable:typedef */
}
