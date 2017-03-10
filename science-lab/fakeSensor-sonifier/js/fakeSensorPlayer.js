(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.fakeNexusSensorConnector", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.modelComponent"],
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensorValues",
            receivesChangesFromNexus: true,
            sendsChangesToNexus: false
        }
    });

    fluid.defaults("fluid.sensorPlayer.simulatedSensor.fakeNexusSensor", {
        gradeNames: ["fluid.sensorPlayer.simulatedSensor"],
        model: {
            sensorValue: 0,
            sensorMax: 1,
            sensorMin: -1,
            simulateChanges: false,
            description: "A simulated version of the fake Nexus sensor (yes, I know this doesn't make sense)."
        }
    });

    fluid.defaults("fluid.sensorPlayer.fakeNexusSensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.simulatedSensor.fakeNexusSensor",
                options: {
                    model: {
                        simulateChanges: false
                    }
                }
            },
            fakeNexusSensorConnector: {
                type: "gpii.fakeNexusSensorConnector",
                options: {
                    members: {
                        nexusHost: window.location.hostname
                    },
                    modelListeners: {
                        "sensorValues.fakeValue": {
                            "this": "{sensor}.applier",
                            "method": "change",
                            "args": ["sensorValue", "{change}.value"]
                        }
                    }
                }
            }
        }
    });

}());
