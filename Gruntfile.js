"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        ts: {
            source: {
                options: {
                    declaration: false,
                    removeComments: false,
                    module: "commonjs",
                    target: "ES5",
                    sourceMap: false
                },
                src: "ts/**/*.ts",
                outDir: "lib"
            }
        },
        nodeunit: {
            all: ["test/*_test.js"]
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            files: ["ts/**/*.ts", "tasks/*.ts"]
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            test: "test/**/*.js",
            gruntfile: "Gruntfile.js"
        },
        jsonlint: {
            pkg: ["package.json"],
            hint: [".jshintrc", "tslint.json"]
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("build", ["ts"]);
    grunt.registerTask("test", ["nodeunit"]);
    grunt.registerTask("test-build", ["ts", "test"]);
    grunt.registerTask("hint", ["tslint", "jshint", "jsonlint"]);
    grunt.registerTask("default", ["hint", "build", "test"]);
};
