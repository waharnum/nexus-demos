"use strict";

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
                    "{that}.events.onData",
                    "{that}.events.onClose"
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
        onDeviceInformation: null, // Device Information data
        onClose: null
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
});

gpii.nexus.atlasScientificConnection.constructReadlineCrParser = function () {
    return SerialPort.parsers.readline("\r");
};

gpii.nexus.atlasScientificConnection.constructSerialPort = function (devicePath, serialPortOptions, serialPortParser, onDataEvent, onCloseEvent) {

    var options = fluid.extend({}, serialPortOptions);
    options.parser = serialPortParser;

    var port = new SerialPort(devicePath, options);

    port.on("data", function(data) {
        onDataEvent.fire(data);
    });

    port.on("close", function() {
        onCloseEvent.fire();
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

    circuitTypes: {
        "EC": {
            sensorName: "Conductivity",
            units: "μS/cm",
            rangeMin: 0,
            rangeMax: 10000,
            nexusPeerComponentPath: "ecSensor",
            nexusPeerComponentOptions: {
                type: "gpii.nexus.atlasScientificDriver.ecSensor"
            }
        },
        "pH": {
            sensorName: "pH",
            units: undefined,
            rangeMin: 0,
            rangeMax: 14,
            nexusPeerComponentPath: "phSensor",
            nexusPeerComponentOptions: {
                type: "gpii.nexus.atlasScientificDriver.phSensor"
            }
        }
    },

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
                    "onClose.log": function () {
                        console.log("Close");
                    },
                    "onClose.destroyPeer": "{atlasScientificDriver}.events.doDestroyNexusPeer"
                }
            }
        },

        nexusBinding: {
            type: "gpii.nexusWebSocketBoundComponent",
            createOnEvent: "{atlasScientificConnection}.events.onDeviceInformation",
            options: {
                circuitType: "{arguments}.0.deviceType",
                members: {
                    nexusHost: "{atlasScientificDriver}.options.nexusHost",
                    nexusPort: "{atlasScientificDriver}.options.nexusPort",
                    nexusPeerComponentPath: {
                        expander: {
                            func: "gpii.nexus.atlasScientificDriver.lookupCircuitData",
                            args: [
                                "{atlasScientificDriver}.options.circuitTypes",
                                "{that}.options.circuitType",
                                "nexusPeerComponentPath"
                            ]
                        }
                    },
                    nexusPeerComponentOptions: {
                        expander: {
                            func: "gpii.nexus.atlasScientificDriver.lookupCircuitData",
                            args: [
                                "{atlasScientificDriver}.options.circuitTypes",
                                "{that}.options.circuitType",
                                "nexusPeerComponentOptions"
                            ]
                        }
                    },
                    nexusBoundModelPath: "sensorData",
                    sendsChangesToNexus: true,
                    managesPeer: true
                },
                model: {
                    sensorData: {
                        name: {
                            expander: {
                                func: "gpii.nexus.atlasScientificDriver.lookupCircuitData",
                                args: [
                                    "{atlasScientificDriver}.options.circuitTypes",
                                    "{that}.options.circuitType",
                                    "sensorName"
                                ]
                            }
                        },
                        units: {
                            expander: {
                                func: "gpii.nexus.atlasScientificDriver.lookupCircuitData",
                                args: [
                                    "{atlasScientificDriver}.options.circuitTypes",
                                    "{that}.options.circuitType",
                                    "units"
                                ]
                            }
                        },
                        rangeMin: {
                            expander: {
                                func: "gpii.nexus.atlasScientificDriver.lookupCircuitData",
                                args: [
                                    "{atlasScientificDriver}.options.circuitTypes",
                                    "{that}.options.circuitType",
                                    "rangeMin"
                                ]
                            }
                        },
                        rangeMax: {
                            expander: {
                                func: "gpii.nexus.atlasScientificDriver.lookupCircuitData",
                                args: [
                                    "{atlasScientificDriver}.options.circuitTypes",
                                    "{that}.options.circuitType",
                                    "rangeMax"
                                ]
                            }
                        },
                        value: 0
                    }
                },
                events: {
                    onPeerDestroyed: "{atlasScientificDriver}.events.onNexusPeerComponentDestroyed"
                },
                listeners: {
                    "{atlasScientificConnection}.events.onReading": {
                        listener: "gpii.nexus.atlasScientificDriver.updateModelSensorValue",
                        args: [
                            "{that}",
                            "{arguments}.0" // Sensor reading
                        ]
                    },
                    "{atlasScientificDriver}.events.doDestroyNexusPeer": {
                        listener: "{that}.destroyNexusPeerComponent"
                    }
                }
            }
        }
    },

    invokers: {
        start: "{atlasScientificConnection}.start",
        destroyNexusPeerComponent: "{that}.events.doDestroyNexusPeer.fire"
    },

    events: {
        doDestroyNexusPeer: null,
        onNexusPeerComponentDestroyed: null
    }

});

gpii.nexus.atlasScientificDriver.lookupCircuitData = function (circuitTypes, deviceType, key) {
    return circuitTypes[deviceType][key];
};

gpii.nexus.atlasScientificDriver.updateModelSensorValue = function (nexusBinding, sensorReading) {
    // Use the first value from the sensor reading
    //
    // For more information, see the Atlas Scientific circuit
    // documentation:
    //
    // - https://www.atlas-scientific.com/_files/_datasheets/_circuit/pH_EZO_datasheet.pdf
    // - https://www.atlas-scientific.com/_files/_datasheets/_circuit/EC_EZO_Datasheet.pdf
    //
    nexusBinding.applier.change("sensorData.value", sensorReading[0]);
};
