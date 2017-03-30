(function () {
    "use strict";

    // An "abstract" grade for presenting sensors
    // An implementing grade needs to supply
    // appropriate dynamic components
    fluid.defaults("gpii.nexusSensorPresentationPanel", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        events: {
            onSensorAppearance: null,
            onSensorRemoval: null
        },
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensors",
            receivesChangesFromNexus: true,
            sendsChangesToNexus: false,
            // Member variable for tracking attached sensor state
            attachedSensors: {}
        },
        modelListeners: {
            sensors: {
                func: "{that}.updateSensorPresentations",
                args: [
                    "{that}",
                    "{change}.value"
                ]
            }
        },
        invokers: {
            updateSensorPresentations: {
                funcName: "gpii.nexusSensorPresentationPanel.updateSensorPresentations"
            }
        }
    });

    // Add / remove function for sensor changes. Handles the following:
    // 1) Fires an event when a sensor is added, argument is the sensor ID
    // 2) Fires an aggregrate event when sensors are removed, argument is
    // an array of sensor IDs
    gpii.nexusSensorPresentationPanel.updateSensorPresentations = function (that, sensors) {

        var sensorsArray = fluid.hashToArray(
            sensors,
            "sensorId"
        );

        // Add loop for new sensors
        fluid.each(sensorsArray, function (sensor) {
            var sensorId = sensor.sensorId;
            if(! that.attachedSensors[sensorId]) {
                console.log(sensorId);
                that.events.onSensorAppearance.fire(sensorId);
                that.attachedSensors[sensorId] = true;
            }
        });

        // Track removed sensor IDs here
        var removedSensorIds = [];

        // Remove loop for any removed sensors
        fluid.each(that.attachedSensors, function (attachedSensor, attachedSensorId) {
            if (! sensors[attachedSensorId]) {
                removedSensorIds.push(attachedSensorId);
                that.attachedSensors[attachedSensorId] = false;
            }
        });
        if(removedSensorIds.length > 0) {
            that.events.onSensorRemoval.fire(removedSensorIds);
        }
    };

}());
