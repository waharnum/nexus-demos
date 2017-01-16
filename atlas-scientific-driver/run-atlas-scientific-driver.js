var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./atlas-scientific-driver.js");

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: "/dev/ttyUSB0",
    listeners: {
        "onStarted.sendDeviceInformationRequest": {
            listener: "{that}.sendDeviceInformationRequest"
        },
        "onReading.log": function (data) {
            console.log("Reading: " + JSON.stringify(data));
        },
        "onDeviceInformation.log": function (data) {
            console.log("Device information: " + JSON.stringify(data));
        }
    }
});

driver.start();
