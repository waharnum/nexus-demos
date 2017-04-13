"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");

var nexusHost = "localhost";
var nexusPort = 9081;

fluid.defaults("gpii.nexus.fakeSensor", {
    gradeNames: ["gpii.nexusWebSocketBoundComponent"],
    model: {
        fakeSensorConfig: {
            updateDelayMs: 1000
        }
    },
    members: {
        nexusHost: nexusHost,
        nexusPort: nexusPort,
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
        },
        "onErrorConstructingPeer.exitProcess": {
            funcName: "gpii.nexus.fakeSensor.logErrorAndExit",
            args: ["{arguments}.0"]
        }
    }
});

fluid.defaults("gpii.nexus.fakeSensor.sinValue", {
    gradeNames: ["gpii.nexus.fakeSensor"],
    members: {
        nexusPeerComponentPath: "fakeSensor",
        nexusPeerComponentOptions: {
            type: "gpii.nexus.fakeSensor"
        }
    },
    model: {
        fakeSensorConfig: {
            updateDelayMs: 2000
        },
        sensorData: {
            name: "Fake Sensor",
            rangeMin: -1,
            rangeMax: 1,
            value: 0
        }
    },
        invokers: {
        "getFakeSensorValue": {
            "funcName": "gpii.nexus.fakeSensor.getFakeSensorValueSin",
            "args": ["{that}"]
        }
    }
});

fluid.defaults("gpii.nexus.fakeSensor.pHValue", {
    gradeNames: ["gpii.nexus.fakeSensor"],
    members: {
        nexusPeerComponentPath: "fakeSensorPH",
        nexusPeerComponentOptions: {
            type: "gpii.nexus.fakeSensorPH"
        }
    },
    model: {
        fakeSensorConfig: {
            updateDelayMs: 5000
        },
        sensorData: {
            name: "Fake pH Sensor",
            rangeMin: 0,
            rangeMax: 14,
            value: 7
        }
    },
        invokers: {
        "getFakeSensorValue": {
            "funcName": "gpii.nexus.fakeSensor.getFakeSensorValuePH"
        }
    }
});


fluid.defaults("gpii.nexus.fakeSensor.temperature", {
    gradeNames: ["gpii.nexus.fakeSensor"],
    members: {
        nexusPeerComponentPath: "fakeSensorTemperature",
        nexusPeerComponentOptions: {
            type: "gpii.nexus.fakeSensorTemperature"
        }
    },
    model: {
        fakeSensorConfig: {
            updateDelayMs: 5000
        },
        sensorData: {
            name: "Fake Temperature Sensor",
            rangeMin: 10,
            rangeMax: 40,
            value: 15
        }
    },
        invokers: {
        "getFakeSensorValue": {
            "funcName": "gpii.nexus.fakeSensor.getFakeSensorValueTemperature"
        }
    }
});
gpii.nexus.fakeSensor.logErrorAndExit = function (error) {
    console.log(error.message);
    process.exit();
};

gpii.nexus.fakeSensor.exitProcess = function () {
    process.exit();
};

gpii.nexus.fakeSensor.update = function (that) {
    var nextValue = that.getFakeSensorValue();
    console.log(that.model.sensorData.name + ": " + nextValue);
    that.applier.change("sensorData.value", nextValue);
    setTimeout(function () {
        gpii.nexus.fakeSensor.update(that);
    }, that.model.fakeSensorConfig.updateDelayMs);
};

// A fairly even sin-based sensor value that moves between -1 and 1
// Calculates the sin period based on the update frequency
gpii.nexus.fakeSensor.getFakeSensorValueSin = function (that) {
    var sinPeriodMs = that.model.fakeSensorConfig.updateDelayMs * 10;
    return Math.sin((new Date().getTime() % sinPeriodMs) * Math.PI * 2 / sinPeriodMs);
};

// a pH sensor type value between 0 and 14
gpii.nexus.fakeSensor.getFakeSensorValuePH = function () {
    return gpii.nexus.fakeSensor.randomFloat(0,14);
};

gpii.nexus.fakeSensor.getFakeSensorValueTemperature = function () {
    return gpii.nexus.fakeSensor.randomFloat(10,40);
};

gpii.nexus.fakeSensor.randomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

gpii.nexus.fakeSensor.randomFloat = function(min, max) {
    return Math.random() * (max - min) + min;
};

var fakeSensor = gpii.nexus.fakeSensor.sinValue();

var fakeSensorPH = gpii.nexus.fakeSensor.pHValue();

var fakeSensorTemperature = gpii.nexus.fakeSensor.temperature();

process.on("SIGINT", function () {
   fakeSensor.destroyNexusPeerComponent();
    fakeSensorPH.destroyNexusPeerComponent();
    fakeSensorTemperature.destroyNexusPeerComponent();
});

fakeSensor.update();
fakeSensorPH.update();
fakeSensorTemperature.update();
