(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.nexusSensorSonificationPanel", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        numberLocale: "en",
        events: {
            onSensorAppearance: null,
            onSensorRemoval: null
        },
        dynamicComponents: {
            sensorSonifier: {
                type: "gpii.sensorPlayer",
                createOnEvent: "onSensorAppearance",
                options: "@expand:gpii.nexusSensorSonificationPanel.getSensorOptions({arguments}.0)"
            }
        },
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensors",
            receivesChangesFromNexus: true,
            sendsChangesToNexus: false,
            attachedSensors: {}
        },
        strings: {
            noSensorsConnected: "No sensors connected"
        },
        modelListeners: {
            sensors: {
                funcName: "gpii.nexusSensorSonificationPanel.updateSonifications",
                args: [
                    "{that}",
                    "{change}.value"
                ]
            }
        }
    });

    gpii.nexusSensorSonificationPanel.getSensorOptions = function (sensorId) {

        var sensorModel = {
            sensorId: sensorId,
            description: "{nexusSensorSonificationPanel}.model.sensors." + sensorId + ".name",
            simulateChanges: false,
            sensorValue: "{nexusSensorSonificationPanel}.model.sensors." + sensorId + ".value",
            sensorMax: "{nexusSensorSonificationPanel}.model.sensors." + sensorId + ".rangeMax",
            sensorMin: "{nexusSensorSonificationPanel}.model.sensors." + sensorId + ".rangeMin"
        };

        var sensorOptions =
        {
            listeners: {
                "{nexusSensorSonificationPanel}.events.onSensorRemoval": {
                   funcName: "gpii.nexusSensorSonificationPanel.checkForRemoval",
                   args: ["{that}", "{that}.sensor", "{arguments}.0"]
               }
           },
            components: {
                sensor: {
                    options: {
                        model: sensorModel
                    }
                }
            }
        };
        return sensorOptions;
    };

    gpii.nexusSensorSonificationPanel.checkForRemoval = function (sensorPlayer, sensor, removedSensorId) {
        console.log("gpii.nexusSensorSonificationPanel.checkForRemoval");
        console.log(sensorPlayer, sensor, removedSensorId);
        if(fluid.get(sensor.model, "sensorId") === removedSensorId) {
            console.log("this sensorPlayer should be removed");
            sensorPlayer.destroy();
            console.log(sensorPlayer);
        }
    };

    gpii.nexusSensorSonificationPanel.updateSonifications = function (that, sensors) {

        var sensorsArray = fluid.hashToArray(
            sensors,
            "sensorId"
        );

        // Add new sensors
        fluid.each(sensorsArray, function (sensor) {
            var sensorId = sensor.sensorId;

            if(! that.attachedSensors[sensorId]) {
                console.log("New sensor to add: " + sensorId);
                that.events.onSensorAppearance.fire(sensorId);
                that.attachedSensors[sensorId] = true;
            }
        });

        // Remove old sensors
        fluid.each(that.attachedSensors, function (attachedSensor, attachedSensorId) {
            if (! sensors[attachedSensorId]) {
                console.log("Sensor to remove: " + attachedSensorId);
                console.log(that);
                that.events.onSensorRemoval.fire(attachedSensorId);
                that.attachedSensors[attachedSensorId] = false;
            }
        });
    };

}());
