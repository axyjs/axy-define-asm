"use strict";

import context = require("index");

export class Dest {
    constructor (private context: context.Context) {
    }

    flush (): void {
    }
}

export class DestDir extends Dest {

}

export class DestFile extends Dest {

}

export class DestOut extends Dest {

}

export function create(context: context.Context): Dest {
    return null;
}
