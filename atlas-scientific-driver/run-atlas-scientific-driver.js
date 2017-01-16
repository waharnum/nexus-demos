var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./atlas-scientific-driver.js");

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: "/dev/ttyUSB0",
    listeners: {
        "onReading.log": function (data) {
            console.log("Reading: " + JSON.stringify(data));
        }
    }
});

driver.start();
