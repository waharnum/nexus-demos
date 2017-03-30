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

    gpii.nexusSensorPresentationPanel.getSensorModelOptions = function (sensorId) {
        var sensorModelOptions = {
            sensorId: sensorId,
            description: "{nexusSensorPresentationPanel}.model.sensors." + sensorId + ".name",
            simulateChanges: false,
            sensorValue: "{nexusSensorPresentationPanel}.model.sensors." + sensorId + ".value",
            sensorMax: "{nexusSensorPresentationPanel}.model.sensors." + sensorId + ".rangeMax",
            sensorMin: "{nexusSensorPresentationPanel}.model.sensors." + sensorId + ".rangeMin"
        };

        return sensorModelOptions;
    };

    // Function used by a sensorPlayer to check the array of
    // removed sensor IDs and invoke its own destroy function
    // if it matches a removed sensor ID
    gpii.nexusSensorPresentationPanel.checkForRemoval = function (sensorPlayer, sensor, removedSensorIds) {
        console.log("gpii.nexusSensorPresentationPanel.checkForRemoval");
        console.log(sensorPlayer, sensor, removedSensorIds);
        console.log(sensorPlayer);
        if(fluid.contains(removedSensorIds,fluid.get(sensor.model, "sensorId"))) {
            console.log("this sensorPlayer should be removed");
            sensorPlayer.destroy();
            console.log(sensorPlayer);
        }
    };

    // Function used by the sensorSonificationPanel to remove
    // dynamically generated container markup when a sensor is
    // removed
    gpii.nexusSensorPresentationPanel.removeSensorDisplayContainer = function (nexusSensorPresentationPanel, sensorContainerClass) {
        console.log(nexusSensorPresentationPanel, sensorContainerClass);
        var removedSensorContainer = nexusSensorPresentationPanel.container.find("." + sensorContainerClass);
        console.log(removedSensorContainer);
        removedSensorContainer.fadeOut(function() {
            removedSensorContainer.remove();
        });
    };

}());
