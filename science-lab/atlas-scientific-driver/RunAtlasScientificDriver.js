var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");
require("./AtlasScientificDriver.js");

var program = require("commander");

var devicePath = "/dev/ttyUSB0";
var nexusHost = "localhost";
var nexusPort = 9081;
var nexusPeerComponentPath = "phSensor";
var nexusPeerComponentType = "gpii.nexus.atlasScientificDriver.phSensor";

// TODO: Query sensor for its type and create peer with appropriate name and grade

program
    .option("-d, --device <device>")
    .option("-p, --ph")
    .option("-c, --conductivity")
    .parse(process.argv);

if (program.device) {
    devicePath = program.device;
}

if (program.conductivity) {
    nexusPeerComponentPath = "conductivitySensor";
    nexusPeerComponentType = "gpii.nexus.atlasScientificDriver.conductivitySensor";
}

gpii.nexus.atlasScientificDriver.exitProcess = function () {
    process.exit();
};

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: devicePath,
    nexusHost: nexusHost,
    nexusPort: nexusPort,
    nexusPeerComponentPath: nexusPeerComponentPath,
    nexusPeerComponentOptions: {
        type: nexusPeerComponentType
    },
    listeners: {
        "onNexusPeerComponentDeleted.exitProcess": {
            funcName: "gpii.nexus.atlasScientificDriver.exitProcess"
        }
    }
});

process.on("SIGINT", function () {
    driver.deleteNexusPeerComponent();
});

driver.start();
