"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");

var nexusHost = "localhost";
var nexusPort = 9081;
var updateDelayMs = 1000;
var sinPeriodMs = 10000;

fluid.registerNamespace("gpii.nexus.fakeSensor");

gpii.nexus.fakeSensor.exitProcess = function () {
    process.exit();
};

var sensor = gpii.nexusWebSocketBoundComponent({
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
    model: {
        sensorData: {
            name: "Fake Sensor",
            rangeMin: -1,
            rangeMax: 1,
            value: 0
        }
    },
    listeners: {
        "onPeerDestroyed.exitProcess": {
            funcName: "gpii.nexus.fakeSensor.exitProcess"
        }
    }
});

process.on("SIGINT", function () {
    sensor.destroyNexusPeerComponent();
});

gpii.nexus.fakeSensor.update = function () {
    var nextValue = Math.sin((new Date().getTime() % sinPeriodMs) * Math.PI * 2 / sinPeriodMs);
    console.log("Fake sensor: " + nextValue);
    sensor.applier.change("sensorData.value", nextValue);
    setTimeout(function () {
        gpii.nexus.fakeSensor.update();
    }, updateDelayMs);
};

gpii.nexus.fakeSensor.update();
