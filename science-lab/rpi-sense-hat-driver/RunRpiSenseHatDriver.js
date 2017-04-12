"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");
require("./RpiSenseHatDriver.js");

var program = require("commander");

var nexusHost = "localhost";
var nexusPort = 9081;
var senseHatNumber = 1;

program
    .option("-h, --host <hostname>", "Nexus hostname")
    .option("-p, --port <port>", "Nexus port number", parseInt)
    .option("-n, --number <integer>", "SenseHAT number", parseInt)
    .parse(process.argv);

if (program.host) {
    nexusHost = program.host;
}

if (program.port) {
    nexusPort = program.port;
}

if (program.number) {
    senseHatNumber = program.number;
}

var sensorNames = [];
sensorNames[1] = "Temperature A";
sensorNames[2] = "Temperature B";

var driver = gpii.nexus.rpiSenseHatDriver({
    nexusHost: nexusHost,
    nexusPort: nexusPort,
    nexusPeerComponentPath: "rpiSenseHatTemp" + senseHatNumber,
    nexusPeerComponentOptions: {
        type: "gpii.nexus.rpiSenseHatDriver.tempSensor" + senseHatNumber
    },
    sensorName: sensorNames[senseHatNumber],
    listeners: {
        "onNexusPeerComponentDestroyed.exitProcess": {
            func: function () { process.exit(); }
        }
    }
});

process.on("SIGINT", function () {
    driver.destroyNexusPeerComponent();
});
