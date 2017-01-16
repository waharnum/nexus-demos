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
            method: "open",
            args: ["{that}.openCallback"]
        },
        openCallback: {
            funcName: "gpii.nexus.atlasScientificDriver.openCallback",
            args: [
                "{arguments}.0", // Error
                "{that}.events.onStarted"
            ]
        },
        sendDeviceInformationRequest: {
            "this": "{that}.serialPort",
            method: "write",
            // TODO: Provide callback for error notification
            args: ["I\r"]
        }
    },

    events: {
        onStarted: null,
        onData: null, // Response data string
        onReading: null, // Array of numbers
        onDeviceInformation: null // Device Information data
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

gpii.nexus.atlasScientificDriver.openCallback = function (error, event) {
    // TODO: Handle error from SerialPort open
    if (!error) {
        event.fire();
    }
};

gpii.nexus.atlasScientificDriver.parseResponse = function (that, response) {
    if (/^\d/.test(response)) {
        // Response starts with a digit, parse as a reading
        that.events.onReading.fire(fluid.transform(response.split(","), parseFloat));
    } else if (response.startsWith("?I")) {
        // Device information
        var deviceInfoData = response.split(",");
        if (deviceInfoData.length === 3) {
            that.events.onDeviceInformation.fire({
                deviceType: deviceInfoData[1],
                firmwareVersion: deviceInfoData[2]
            });
        }
    }
};
