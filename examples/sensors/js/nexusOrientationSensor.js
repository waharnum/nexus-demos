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
            receivesChangesFromNexus: false
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
        listeners: {
            "onCreate.loadSensorDriver": {
                funcName: "gpii.nexusOrientationSensor.loadSensorDriver",
                args: [
                    "{that}.applier",
                    "{that}.nexusBoundModelPath"
                ]
            }
        }
    });

    gpii.nexusOrientationSensor.loadSensorDriver = function (applier, modelPath) {
        var app = new SensorAPI();
        app.loadDriver("../../node_modules/sensorapijs/driver/deviceOrientation.js");
        app.onDeviceAdded(function(device) {
            device.sensors.orientation.subscribe(function(data) {
                applier.change(modelPath, data);
            });
        });
    };

    gpii.nexusOrientationSensor.displayValues = function (data, elem) {
        elem.text(JSON.stringify(data));
    };

}());
