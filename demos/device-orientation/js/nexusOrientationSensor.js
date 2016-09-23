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
                    "{arguments}.0" // event data
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

    gpii.nexusOrientationSensor.handleSensorEvent = function (that, applier, modelPath, eventData) {
        var now = Date.now();
        if (now > that.lastUpdated + that.minimumUpdatePeriodMs) {
            that.lastUpdated = now;
            // Update the model with the orientation info from eventData
            applier.change(modelPath, {
                alpha: eventData.alpha,
                beta: eventData.beta,
                gamma: eventData.gamma,
                absolute: eventData.absolute
            });
        }
    };

    gpii.nexusOrientationSensor.displayValues = function (data, elem) {
        elem.text(JSON.stringify(data));
    };

}());
