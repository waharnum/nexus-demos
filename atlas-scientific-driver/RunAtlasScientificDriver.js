var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");
require("./AtlasScientificDriver.js");

var devicePath = "/dev/ttyUSB0";
var nexusHost = "localhost";
var nexusPort = 9081;
var nexusPeerComponentPath = "phSensor";

// TODO: Read parameters from command line (such as devicePath)
// TODO: Make new grade type for ph sensor peer
// TODO: Query sensor for its type and create peer with appropriate name and grade

gpii.nexus.atlasScientificDriver.exitProcess = function () {
    process.exit();
};

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: devicePath,
    nexusHost: nexusHost,
    nexusPort: nexusPort,
    nexusPeerComponentPath: nexusPeerComponentPath,
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
