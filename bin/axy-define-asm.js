#!/usr/bin/env node

var success = false;

process.on("exit", function () {
    if (!success) {
        console.error("The task is made not to the end");
    }
});

function done() {
    success = true;
}

if (!require("./../index.js").runCLI(process.argv.slice(2), done)) {
    process.exit(1);
}
