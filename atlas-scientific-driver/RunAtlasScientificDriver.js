var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");
require("./AtlasScientificDriver.js");

var devicePath = "/dev/ttyUSB0";
var nexusHost = "localhost";
var nexusPort = 9081;
var nexusPeerPath = "phSensor";

// TODO: Read parameters from command line (such as devicePath)
// TODO: Make new grade type for ph sensor peer
// TODO: Move peer construction into driver grade
// TODO: Query sensor for its type and create peer with appropriate name and grade
// TODO: Delete Nexus peer upon termination

var promise = gpii.constructNexusPeer(nexusHost, nexusPort, nexusPeerPath, {
    type: "fluid.modelComponent",
    options: {
        model: {
            sensorValue: 0
        }
    }
});

promise.then(function () {
    var driver = gpii.nexus.atlasScientificDriver({
        devicePath: devicePath,
        nexusHost: nexusHost,
        nexusPort: nexusPort,
        nexusPeerPath: nexusPeerPath
    });

    driver.start();
});
