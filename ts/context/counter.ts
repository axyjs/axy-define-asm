"use strict";

export class Counter {

    constructor (private tDone: Function, private debug: boolean = false) {
    }

    public begin(message: string = null): void {
        this.count += 1;
        if (this.debug) {
            console.log("Begin " + message + " [" + this.count + "]");
        }
    }

    /* tslint:disable:typedef */
    public done = (message: string = null): boolean => {
        this.count -= 1;
        if (this.debug) {
            console.log("Done " + message + " [" + this.count + "]");
        }
        if (this.count !== 0) {
            return false;
        }
        if (typeof this.tDone === "function") {
            this.tDone.call(null);
        }
        return true;
    };
    /* tslint:enable:typedef */

    private count: number = 0;
}
