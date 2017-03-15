(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.nexusSensorConnector", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.modelComponent"],
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensors",
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

    fluid.defaults("fluid.sensorPlayer.simulatedSensor.nexusPHSensor", {
        gradeNames: ["fluid.sensorPlayer.simulatedSensor"],
        model: {
            sensorValue: 0,
            sensorMax: 14,
            sensorMin: 0,
            simulateChanges: false,
            description: "A Nexus-attached pH Sensor"
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
                type: "gpii.nexusSensorConnector",
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

    fluid.defaults("fluid.sensorPlayer.nexusPHSensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.simulatedSensor.nexusPHSensor",
                options: {
                    model: {
                        simulateChanges: false
                    }
                }
            },
            fakeNexusSensorConnector: {
                type: "gpii.nexusSensorConnector",
                options: {
                    members: {
                        nexusHost: "172.16.2.69"
                    },
                    modelListeners: {
                        "sensors.phSensor.value": {
                            "this": "{sensor}.applier",
                            "method": "change",
                            "args": ["sensorValue", "{change}.value"]
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.sensorPlayer.nexusConductivitySensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.simulatedSensor.nexusPHSensor",
                options: {
                    model: {
                        simulateChanges: false
                    }
                }
            },
            fakeNexusSensorConnector: {
                type: "gpii.nexusSensorConnector",
                options: {
                    members: {
                        nexusHost: "172.16.2.69"
                    },
                    modelListeners: {
                        "sensors.phSensor.value": {
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
