var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    SerialPort = require("serialport");

fluid.defaults("gpii.nexus.atlasScientificDriver", {
    gradeNames: "fluid.component",

    devicePath: null, // To be provided by user

    serialPortOptions: {
        autoOpen: false,
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1
    },

    members: {
        serialPortParser: "@expand:gpii.nexus.atlasScientificDriver.constructReadlineCrParser()",
        serialPort: {
            expander: {
                funcName: "gpii.nexus.atlasScientificDriver.constructSerialPort",
                args: [
                    "{that}.options.devicePath",
                    "{that}.options.serialPortOptions",
                    "{that}.serialPortParser",
                    "{that}.events.onData"
                ]
            }
        }
    },

    invokers: {
        start: {
            "this": "{that}.serialPort",
            method: "open"
        }
    },

    events: {
        onData: null,
        onReading: null
    },

    listeners: {
        onData: {
            listener: "gpii.nexus.atlasScientificDriver.parseResponse",
            args: [
                "{that}",
                "{arguments}.0" // response
            ]
        }
    }
})

gpii.nexus.atlasScientificDriver.constructReadlineCrParser = function () {
    return SerialPort.parsers.readline("\r");
};

gpii.nexus.atlasScientificDriver.constructSerialPort = function (devicePath, serialPortOptions, serialPortParser, onDataEvent) {

    var options = fluid.extend({}, serialPortOptions);
    options.parser = serialPortParser;

    var port = new SerialPort(devicePath, options);

    port.on("data", function(data) {
        onDataEvent.fire(data);
    });

    return port;
};

gpii.nexus.atlasScientificDriver.parseResponse = function (that, response) {
    // TODO: Parse response
    that.events.onReading.fire(response);
};

// **********

var driver = gpii.nexus.atlasScientificDriver({
    devicePath: "/dev/ttyUSB0",
    listeners: {
        "onReading.log": function (data) {
            console.log("Reading: " + data);
        }
    }
});

driver.start();
