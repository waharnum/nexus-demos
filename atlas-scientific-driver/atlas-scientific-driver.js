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
        "onData.parseResponse": {
            listener: "gpii.nexus.atlasScientificDriver.parseResponse",
            args: [
                "{that}",
                "{arguments}.0" // Response
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
    // If the response starts with a digit, parse as a reading
    if (/^\d/.test(response)) {
        that.events.onReading.fire(fluid.transform(response.split(","), parseFloat));
    }
};
