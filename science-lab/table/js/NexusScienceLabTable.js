(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.nexusScienceLabTable", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensorValues",
            receivesChangesFromNexus: true,
            sendsChangesToNexus: false
        },
        modelListeners: {
            sensorValues: [
                "gpii.nexusScienceLabTable.log({change}.value)"
            ]
        }
    });

    // TODO: Render the sensor values in a table

    gpii.nexusScienceLabTable.log = function (sensorValues) {
        console.log(JSON.stringify(sensorValues));
    };

}());
