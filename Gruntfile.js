"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: ["**/*.js"],
            options: {
                jshintrc: true
            }
        },
        jsonlint: {
            all: ["package.json", ".jshintrc", "demos/**/*.json", "src/**/*.json"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");

    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("lint", "Run jshint and jsonlint", ["jshint", "jsonlint"]);
};
