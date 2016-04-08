/* global SensorAPI */

(function () {
    "use strict";

    fluid.defaults("gpii.nexusOrientationSensor", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        selectors: {
            displayOrientationValues: ".gpiic-display-orientation-values"
        },
        members: {
            nexusHost: "localhost", // Set to Nexus host
            nexusPeerComponentPath: "nexus.sensors",
            nexusBoundModelPath: "orientation",
            sendsChangesToNexus: true,
            receivesChangesFromNexus: false,
            lastUpdated: 0,
            minimumUpdatePeriodMs: 100
        },
        model: {
            orientation: {}
        },
        modelListeners: {
            orientation: {
                funcName: "gpii.nexusOrientationSensor.displayValues",
                args: ["{change}.value", "{that}.dom.displayOrientationValues"]
            }
        },
        invokers: {
            handleSensorEvent: {
                funcName: "gpii.nexusOrientationSensor.handleSensorEvent",
                args: [
                    "{that}",
                    "{that}.applier",
                    "{that}.nexusBoundModelPath",
                    "{arguments}.0" // data
                ]
            }
        },
        listeners: {
            "onCreate.loadSensorDriver": {
                funcName: "gpii.nexusOrientationSensor.loadSensorDriver",
                args: ["{that}.handleSensorEvent"]
            }
        }
    });

    gpii.nexusOrientationSensor.loadSensorDriver = function (eventHandler) {
        var app = new SensorAPI();
        app.loadDriver("../../node_modules/sensorapijs/driver/deviceOrientation.js");
        app.onDeviceAdded(function(device) {
            device.sensors.orientation.subscribe(eventHandler);
        });
    };

    gpii.nexusOrientationSensor.handleSensorEvent = function (that, applier, modelPath, data) {
        var now = Date.now();
        if (now > that.lastUpdated + that.minimumUpdatePeriodMs) {
            that.lastUpdated = now;
            applier.change(modelPath, data);
        }
    };

    gpii.nexusOrientationSensor.displayValues = function (data, elem) {
        elem.text(JSON.stringify(data));
    };

}());
