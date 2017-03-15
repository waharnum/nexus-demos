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

    fluid.defaults("fluid.sensorPlayer.nexusFakeSensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.simulatedSensor",
                options: {
                    model: {
                        description: "A Nexus-attached Fake Sensor",
                        simulateChanges: false,
                        sensorValue: "{nexusSensorConnector}.model.sensors.fakeSensor.value",
                        sensorMax: "{nexusSensorConnector}.model.sensors.fakeSensor.rangeMax",
                        sensorMin: "{nexusSensorConnector}.model.sensors.fakeSensor.rangeMin"
                    }
                }
            },
            nexusSensorConnector: {
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
                type: "fluid.sensorPlayer.simulatedSensor",
                options: {
                    model: {
                        description: "A Nexus-attached pH Sensor",
                        simulateChanges: false,
                        sensorValue: "{nexusSensorConnector}.model.sensors.phSensor.value",
                        sensorMax: "{nexusSensorConnector}.model.sensors.phSensor.rangeMax",
                        sensorMin: "{nexusSensorConnector}.model.sensors.phSensor.rangeMin"
                    }
                }
            },
            nexusSensorConnector: {
                type: "gpii.nexusSensorConnector",
                options: {
                    members: {
                        nexusHost: "172.16.2.69"
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.sensorPlayer.nexusConductivitySensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.simulatedSensor",
                options: {
                    model: {
                        description: "A Nexus-attached Conductivity Sensor",
                        simulateChanges: false,
                        sensorValue: "{nexusSensorConnector}.model.sensors.ecSensor.value",
                        sensorMax: "{nexusSensorConnector}.model.sensors.ecSensor.rangeMax",
                        sensorMin: "{nexusSensorConnector}.model.sensors.ecSensor.rangeMin"
                    }
                }
            },
            nexusSensorConnector: {
                type: "gpii.nexusSensorConnector",
                options: {
                    members: {
                        nexusHost: "172.16.2.69"
                    }
                }
            }
        }
    });

}());
