(function () {
    "use strict";

    fluid.defaults("gpii.nexusSensorConnector", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.modelComponent"],
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensors",
            receivesChangesFromNexus: true,
            sendsChangesToNexus: false
        }
    });

    fluid.defaults("gpii.sensorPlayer.nexusSensorPlayer", {
        gradeNames: ["gpii.sensorPlayer"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor",
                options: {
                    model: {
                        simulateChanges: false
                        // description: "{nexusSensorConnector}.model.sensors.fakeSensor.name",
                        // sensorValue: "{nexusSensorConnector}.model.sensors.fakeSensor.value",
                        // sensorMax: "{nexusSensorConnector}.model.sensors.fakeSensor.rangeMax",
                        // sensorMin: "{nexusSensorConnector}.model.sensors.fakeSensor.rangeMin"
                    }
                }
            },
            nexusSensorConnector: {
                type: "gpii.nexusSensorConnector",
                options: {
                    members: {
                        nexusHost: window.location.hostname
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.sensorPlayer.nexusFakeSensorPlayer", {
        gradeNames: ["gpii.sensorPlayer"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor",
                options: {
                    model: {
                        description: "{nexusSensorConnector}.model.sensors.fakeSensor.name",
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
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.sensorPlayer.nexusPHSensorPlayer", {
        gradeNames: ["gpii.sensorPlayer"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor",
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

    fluid.defaults("gpii.sensorPlayer.nexusConductivitySensorPlayer", {
        gradeNames: ["gpii.sensorPlayer"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor",
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
