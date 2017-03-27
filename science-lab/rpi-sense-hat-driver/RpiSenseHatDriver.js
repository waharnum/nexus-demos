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
        start: {
            "this": "{that}",
            method: "getReading"
        },
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

var sense = gpii.nexus.rpiSenseHat({
    listeners: {
        onReading: function (data) { console.log(JSON.stringify(data, null, 4)); }
    }
});

sense.start();
