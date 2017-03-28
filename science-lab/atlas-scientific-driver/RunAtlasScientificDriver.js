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

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: devicePath,
    nexusHost: nexusHost,
    nexusPort: nexusPort,
    listeners: {
        "onNexusPeerComponentDestroyed.exitProcess": {
            func: function () { process.exit(); }
        }
    }
});

process.on("SIGINT", function () {
    driver.destroyNexusPeerComponent();
});

driver.start();
