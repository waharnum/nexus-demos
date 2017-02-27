var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    SerialPort = require("serialport");

fluid.defaults("gpii.nexus.atlasScientificConnection", {
    gradeNames: "fluid.component",

    devicePath: null, // To be provided by user

    serialPortOptions: {
        autoOpen: false,
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1
    },

    members: {
        serialPortParser: "@expand:gpii.nexus.atlasScientificConnection.constructReadlineCrParser()",
        serialPort: {
            expander: {
                funcName: "gpii.nexus.atlasScientificConnection.constructSerialPort",
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
            funcName: "gpii.nexus.atlasScientificConnection.openCallback",
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
            listener: "gpii.nexus.atlasScientificConnection.parseResponse",
            args: [
                "{that}",
                "{arguments}.0" // Response
            ]
        }
    }
})

gpii.nexus.atlasScientificConnection.constructReadlineCrParser = function () {
    return SerialPort.parsers.readline("\r");
};

gpii.nexus.atlasScientificConnection.constructSerialPort = function (devicePath, serialPortOptions, serialPortParser, onDataEvent) {

    var options = fluid.extend({}, serialPortOptions);
    options.parser = serialPortParser;

    var port = new SerialPort(devicePath, options);

    port.on("data", function(data) {
        onDataEvent.fire(data);
    });

    return port;
};

gpii.nexus.atlasScientificConnection.openCallback = function (error, event) {
    // TODO: Handle error from SerialPort open
    if (!error) {
        event.fire();
    }
};

gpii.nexus.atlasScientificConnection.parseResponse = function (that, response) {
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

fluid.defaults("gpii.nexus.atlasScientificDriver", {
    gradeNames: "fluid.modelComponent",

    devicePath: null, // To be provided by user
    nexusHost: "localhost",
    nexusPort: 9081,
    nexusPeerComponentPath: null, // To be provided by user

    components: {
        atlasScientificConnection: {
            type: "gpii.nexus.atlasScientificConnection",
            options: {
                devicePath: "{atlasScientificDriver}.options.devicePath",
                listeners: {
                    "onStarted.sendDeviceInformationRequest": {
                        listener: "{that}.sendDeviceInformationRequest"
                    },
                    "onReading.log": function (data) {
                        console.log("Reading: " + JSON.stringify(data));
                    },
                    "onDeviceInformation.log": function (data) {
                        console.log("Device information: " + JSON.stringify(data));
                    },
                    "onReading.updateModel": {
                        listener: "{atlasScientificDriver}.updateModelSensorValue"
                    }
                }
            }
        },
        nexusBinding: {
            type: "gpii.nexusWebSocketBoundComponent",
            options: {
                members: {
                    nexusHost: "{atlasScientificDriver}.options.nexusHost",
                    nexusPort: "{atlasScientificDriver}.options.nexusPort",
                    nexusPeerComponentPath: "{atlasScientificDriver}.options.nexusPeerComponentPath",
                    nexusBoundModelPath: "sensorValue",
                    sendsChangesToNexus: true,
                    managesPeer: true,
                    nexusPeerComponentOptions: {
                        type: "gpii.nexus.atlasScientificDriver.phSensor"
                    }
                },
                model: {
                    sensorValue: 0
                }
            }
        }
    },

    invokers: {
        start: "{atlasScientificConnection}.start",
        updateModelSensorValue: {
            funcName: "gpii.nexus.atlasScientificDriver.updateModelSensorValue",
            args: [
                "{that}.nexusBinding",
                "{arguments}.0" // Sensor reading
            ]
        },
        deleteNexusPeerComponent: "{nexusBinding}.deleteNexusPeerComponent"
    },

    events: {
        onNexusPeerComponentDeleted: "{nexusBinding}.events.onPeerDeleted"
    }

});

gpii.nexus.atlasScientificDriver.updateModelSensorValue = function (nexusBinding, sensorReading) {
    nexusBinding.applier.change("sensorValue", sensorReading[0]);
};
