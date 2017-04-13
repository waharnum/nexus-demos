"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    nodeimu = require("nodeimu");

fluid.defaults("gpii.nexus.rpiSenseHat", {
    gradeNames: "fluid.component",

    readIntervalMs: 1000,

    members: {
        imu: "@expand:gpii.nexus.rpiSenseHat.constructImu()"
    },

    invokers: {
        getReading: {
            funcName: "gpii.nexus.rpiSenseHat.getReading",
            args: [
                "{that}",
                "{that}.imu",
                "{that}.options.readIntervalMs",
                "{that}.events.onReading"
            ]
        }
    },

    events: {
        onReading: null
    },

    listeners: {
        "onCreate.startReading": "{that}.getReading"
    }
});

gpii.nexus.rpiSenseHat.constructImu = function () {
    return new nodeimu.IMU();
};

gpii.nexus.rpiSenseHat.getReading = function (that, imu, readIntervalMs, onReadingEvent) {
    imu.getValue(function (e, data) {
        onReadingEvent.fire(data);
        setTimeout(function () {
            that.getReading();
        }, readIntervalMs);
    });
};

fluid.defaults("gpii.nexus.rpiSenseHatDriver", {
    gradeNames: "fluid.modelComponent",

    nexusHost: "localhost",
    nexusPort: 9081,
    nexusPeerComponentPath: "rpiSenseHatTemp",
    nexusPeerComponentOptions: {
        type: "gpii.nexus.rpiSenseHatDriver.tempSensor"
    },
    sensorName: "Temperature",

    components: {
        sense: {
            type: "gpii.nexus.rpiSenseHat",
            options: {
                listeners: {
                    "onReading.log": function (data) {
                        console.log(JSON.stringify(data, null, 4));
                    }
                }
            }
        },
        tempNexusBinding: {
            type: "gpii.nexusWebSocketBoundComponent",
            options: {
                members: {
                    nexusHost: "{rpiSenseHatDriver}.options.nexusHost",
                    nexusPort: "{rpiSenseHatDriver}.options.nexusPort",
                    nexusPeerComponentPath:
                        "{rpiSenseHatDriver}.options.nexusPeerComponentPath",
                    nexusPeerComponentOptions:
                        "{rpiSenseHatDriver}.options.nexusPeerComponentOptions",
                    nexusBoundModelPath: "sensorData",
                    sendsChangesToNexus: true,
                    managesPeer: true
                },
                model: {
                    sensorData: {
                        name: "{rpiSenseHatDriver}.options.sensorName",
                        units: "C",
                        rangeMin: 10,
                        rangeMax: 40,
                        value: 25
                    }
                },
                events: {
                    onErrorConstructingPeer: "{rpiSenseHatDriver}.events.onErrorConstructingPeer",
                    onPeerDestroyed: "{rpiSenseHatDriver}.events.onNexusPeerComponentDestroyed"
                },
                listeners: {
                    "{rpiSenseHat}.events.onReading": {
                        listener: "gpii.nexus.rpiSenseHatDriver.updateTemp",
                        args: [
                            "{that}",
                            "{arguments}.0" // Sensor reading
                        ]
                    },
                    "{rpiSenseHatDriver}.events.doDestroyNexusPeer": {
                        listener: "{that}.destroyNexusPeerComponent"
                    }
                }
            }
        }
    },

    invokers: {
        destroyNexusPeerComponent: "{that}.events.doDestroyNexusPeer.fire"
    },

    events: {
        onErrorConstructingPeer: null,
        doDestroyNexusPeer: null,
        onNexusPeerComponentDestroyed: null
    }

});

gpii.nexus.rpiSenseHatDriver.updateTemp = function (nexusBinding, senseHatData) {
    nexusBinding.applier.change("sensorData.value", senseHatData.temperature);
};
