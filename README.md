# Assembly axy.define Project

See [axy.define](https://github.com/axyjs/axy-define).

## Install

```
npm install axy-define-asm
```

## Command-Line Utility

`axy-define-asm`.
Located in the directory `bin`.

Example: 
```
axy-define-asm --source=js --outDir=outJS
```

No arguments, only options:

```
    --addExt=ext      Add an extension to assembly
-a, --all             Add all files
    --allText         Process all files as text
    --appendVars=vars Append vars to the wrapper (by default 'process, global')
-d, --define=prefix   Name of define function (axy.define by default)
-e, --error           Show information about errors
    --fixTS           Fix TypeScript artifacts
    --globalWrapper   Top wrapper for appendVars
    --ignoreDir=dir   Ignore a dir
    --ignoreExt=ext   Ignore an extension
    --ignoreFile=file Ignore a file
-o, --out             Output to stdout
    --outDir=dir      Output directory (follow the structure of source)
    --outFile=file    Assemble to a single file
    --outSelf         Rewrite source file(s)
-p, --pretty          Formatted output
-r, --root=dir        Root directory
-s, --source=dir|file Source file or directory
    --sourceMap       Changing the source map
-u, --useStrict       Add 'use strict'
-t, --utime           Check update time of destination files
    --verbose=[level] Verbose level (1, 2), silence by default
```

More detailed description see below.

## API

```javascript
var asm = require("axy-define-asm");
var options = {
    source: "/var/www/js",
    outDir: "/var/www/outJS"
};
asm.run(options);
```

These options are the same as CLI-options.
Additional `filter` and `wrap`.

## Example

Example of a source file:
 
```javascript
exports.sum = function sum(a, b) {
    return a + b;
};
```

And the resulting file:

```javascript
axy.define("/sum.js", function (exports, module, require, __filename, __dirname, global, process) {
exports.sum = function sum(a, b) {
    return a + b;
};
});
```

## Description of options

Requires two options: `source` and one of the out-options (`out`, `outDir`, `outFile` or `outSelf`).
All other options are optional.

`outDir`, `outFile` and `outSelf` can not be used in conjunction.
`out` may be used together with other.

##### `source (string)`

JS source code.
A single file or a directory.

##### `outDir (string)`

The directory of resulting axy.define-modules.
Reproduces the structure of `source`.

If `source` is a single file then in `outDir` created `index.js` (and possible `index.js.map`, see `sourceMap` option).

##### `outFile (string)`

The single resulting file.
If the `source` is a directory then all files from it will be assembled to the single file.

##### `outSelf (boolean)`

The source files are replaced with the final files.
Is used if the original files are intermediate (compiled from TypeScript sources for example).

##### `out (string)`

The assembly result written to the stdout.
For assembly in the fly.

It option may be used together with other.
Simultaneous output and write in files.

Cannot be used in conjunction with `verbose`.

##### `addExt (string[])`

By default, processed files with extensions `js` and `json`.
You can add other extensions.

In CLI the option can be used multiple times.

```
--addExt=txt --addExt=html
```

##### `all (boolean)`

Adds all of the files in the assembly (not only js and json).
Then unnecessary files can be avoided using the `ignore*` options.

`*.map` files are not affected.
They need to add an explicit: `--addExt=map`.

##### `ignoreExt`, `ignoreDir`, `ignoreFile`

Ignore specified files, directories and extensions.
In CLI can be used multiple times.

```
--all --ignoreExt=php --ignoreDir=img
```

The names of files and directories are relative.

```
--source=/var/www/js --ignoreFile=modules/mo.js
```

Ignored `/var/www/js/modules/mo.js`.

##### `define`

Name of define function (`axy.define` by default).

```
--define=mydefine
```

Result:

```javascript
mydefine("/mo.js", function (...) {
   // ...
});
```

##### `appendVars (string)`

By default to the standard CommonJS arguments list (`exports`...`__dirname`) added `global` and `process`.

```javascript
--appendVars="global,process,console"
```

Result:
```javascript
axy.define("/sum.js", function (exports, module, require, __filename, __dirname, global, process, console) {
    // ...
});
```

```javascript
--appendVars=
```

Result (the standard wrapper):
```javascript
axy.define("/sum.js", function (exports, module, require, __filename, __dirname) {
    // ...
});
```

##### `globalWrapper (boolean)`

Move additional variables to the top wrapper.

```javascript
axy.define("/sum.js", function (exports, module, require, __filename, __dirname, global, process) {
    (function (exports, module, require, __filename, __dirname) {
        global; // global is available
        arguments.length; // 5
    })(exports, module, require, __filename, __dirname);    
});
```

##### `useStrict (boolean)`

Adds a string `use strict;` to the top of the code.

##### `root (string)`

By default, the source directory "mounted" to the root of the virtual file system.
You can change this.

```
--source=/var/www/js --root=/modules
```

The real file `/var/www/js/index.js` - the virtual file `/modules/index.js`.

##### `sourceMap (boolean)`

**This feature is not yet implemented**

Moves the source map files and edits them.
 
##### `utime (boolean)`

**This feature is not yet implemented**

By default, the resulting files are created, even if they already exist.

If specified `utime`, existing will be checked and the time of modification will be compared.
If a source file is older than the destination file, nothing is done.
If specified `--out` the resulting file will be displayed.

##### `verbose (boolean|number)`

By default, logs are not displayed.
If specify `--verbose` or `--verbose=1` the processed files will be displayed.
For `--verbose=2` will be displayed additional information.

Incompatible with `--out`.
The code will be displayed mixed with logs.

##### `error (boolean)`

By default all exceptions are caught and displayed just "error". 
This is done so the exception trace does not get to a browser.

But it is difficult to debug.
At the time of debugging output can be enabled.

##### `pretty (boolean)`

Default output:

```javascript
axy.define("/sum.js", function (exports, module, require, __filename, __dirname, global, process) {"use strict"; (function (exports, module, require, __filename, __dirname) {
var x = 1;
var y = 2;
module.exports = x + y;
})(exports, module, require, __filename, __dirname);});
```

Pretty output:

```javascript
axy.define("/sum.js", function (exports, module, require, __filename, __dirname, global, process) {
    "use strict"; 
    (function (exports, module, require, __filename, __dirname) {
        var x = 1;
        var y = 2;
        module.exports = x + y;
    })(exports, module, require, __filename, __dirname);
});
```

##### `allText (boolean)`

Processes all files as text.

##### `fixTS (boolean)`

Fixes some artifacts of TypeScript.

##### `filter (function)`

Only available in the API.

```javascript
(filename: string, basename: string, ext: string, isDir: boolean, options: IOptions): boolean;
```

Called for each file and directory and determines whether to process it (`TRUE`) or ignore (`FALSE`).

`filename` if relative path.
For the source directory `/var/www/js` and a file `/var/www/js/modules/mo.js`:

* `filename` is `modules/mo.js`
* `basename` is `mo.js`
* `ext` is `js`
* `isDir` is `FALSE`
* `options` is the full options dictionary 

The example:

```javascript
var options = {
    source: "/var/www/js",
    outDir: "/var/www/outJS",
    filter: function (filename) {
        if (filename === "modules/trash.js") {
            return false;
        }
        return true;
    }
};
```

##### `wrap (function)`

Only available in the API.

```javascript
(content: string, filename: string, ext: string, options: IOptions): string
```

Creates a wrapper for `define`:

```
axy.define("/module/name.js", <-- wrapper -->); 
```

* `content` is the file content
* `filename` is the relative filename
* `ext` is the extension
* `options` is the full options dictionary

Takes as input all files (not only JS).
For different extensions may need a different type of wrapper.
Return `NULL` runs the standard wrapper.

```javascript
var options = {
    // ...
    wrap: function (content, filename, ext) {
        if (ext !== 'json') {
            return null; // standard wrapper for not-JSON files      
        }
        return "function () {return " + content + " }";        
    }
};
```
