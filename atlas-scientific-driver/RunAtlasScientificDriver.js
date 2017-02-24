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
// TODO: Delete Nexus peer upon termination

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: devicePath,
    nexusHost: nexusHost,
    nexusPort: nexusPort,
    nexusPeerComponentPath: nexusPeerComponentPath
});

driver.start();
