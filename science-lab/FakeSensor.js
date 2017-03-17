"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");

var nexusHost = "localhost";
var nexusPort = 9081;
var updateDelayMs = 1000;
var sinPeriodMs = 10000;

fluid.defaults("gpii.nexus.fakeSensor", {
    gradeNames: ["gpii.nexusWebSocketBoundComponent"],
    members: {
        nexusHost: nexusHost,
        nexusPort: nexusPort,
        nexusPeerComponentPath: "fakeSensor",
        nexusPeerComponentOptions: {
            type: "gpii.nexus.fakeSensor"
        },
        nexusBoundModelPath: "sensorData",
        sendsChangesToNexus: true,
        managesPeer: true
    },
    invokers: {
        "update": {
            "funcName": "gpii.nexus.fakeSensor.update",
            "args": "{that}"
        }
    },
    listeners: {
        "onPeerDestroyed.exitProcess": {
            funcName: "gpii.nexus.fakeSensor.exitProcess"
        }
    }
});

fluid.defaults("gpii.nexus.fakeSensor.sinValue", {
    gradeNames: ["gpii.nexus.fakeSensor"],
    model: {
        sensorData: {
            name: "Fake Sensor",
            rangeMin: -1,
            rangeMax: 1,
            value: 0
        }
    },
        invokers: {
        "getFakeSensorValue": {
            "funcName": "gpii.nexus.fakeSensor.getFakeSensorValueSin"
        }
    }
});

gpii.nexus.fakeSensor.exitProcess = function () {
    process.exit();
};

gpii.nexus.fakeSensor.update = function (that) {
    var nextValue = that.getFakeSensorValue();
    console.log("Fake sensor: " + nextValue);
    that.applier.change("sensorData.value", nextValue);
    setTimeout(function () {
        gpii.nexus.fakeSensor.update(that);
    }, updateDelayMs);
};

// A fairly even sin-based sensor value that moves between -1 and 1
gpii.nexus.fakeSensor.getFakeSensorValueSin = function () {
    return Math.sin((new Date().getTime() % sinPeriodMs) * Math.PI * 2 / sinPeriodMs);
};

var sensor = gpii.nexus.fakeSensor.sinValue();

process.on("SIGINT", function () {
    sensor.destroyNexusPeerComponent();
});

sensor.update();
