"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");
require("./AtlasScientificDriver.js");

var program = require("commander");

var devicePath = "/dev/ttyUSB0";
var nexusHost = "localhost";
var nexusPort = 9081;

program
    .option("-d, --device <device>")
    .parse(process.argv);

if (program.device) {
    devicePath = program.device;
}

gpii.nexus.atlasScientificDriver.logErrorAndExit = function (error) {
    console.log(error.message);
    process.exit();
};

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: devicePath,
    nexusHost: nexusHost,
    nexusPort: nexusPort,
    listeners: {
        "onErrorConstructingPeer.exitProcess": {
            funcName: "gpii.nexus.atlasScientificDriver.logErrorAndExit",
            args: ["{arguments}.0"]
        },
        "onNexusPeerComponentDestroyed.exitProcess": {
            func: function () { process.exit(); }
        }
    }
});

process.on("SIGINT", function () {
    driver.destroyNexusPeerComponent();
});

driver.start();
