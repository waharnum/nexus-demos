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
            attachedSensors: {},
            attachedContainers: []
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
            var sensorId = sensor.sensorId,
                sensorName = sensor.name;
            if(! that.attachedSensors[sensorId]) {
                that.events.onSensorAppearance.fire(sensorId, sensorName);
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

    // Generates common model relay options to let a presenter be
    // synchronized with a particular sensor model path
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

    // Generates common listener options for sensor presenters to handle
    // their dynamicComponent lifecycle,
    // specifically:
    // onCreate.appendSensorDisplayContainer:
    // appends sensor-specific container markup so that a
    // new sensor has somewhere to create any viewComponents
    //
    // onCreate.fireOnSensorDisplayContainerAppended:
    // notifies that the display container is appended;
    // viewComponents associated with the sensor can use this
    // for their createOnEvent
    //
    // {nexusSensorPresentationPanel}.events.onSensorRemoval:
    // Adds a listener that lets a sensor presentor check if it should
    // be removed when the onSensorRemoval event is fired by
    // the presentation panel
    //
    // onDestroy.removeSensorDisplayContainer
    // Calls a function of the nexusSensorPresentation panel
    // to let it clean up the container after the associated
    // presenter has been destroyed
    gpii.nexusSensorPresentationPanel.getSensorPresenterListenerOptions = function (sensorId, sensorContainerClass, sensorName) {
        var sensorListenerOptions = {
           "onCreate.appendSensorDisplayContainer": {
               funcName: "gpii.nexusSensorPresentationPanel.addSensorDisplayContainer",
               args: ["{nexusSensorPresentationPanel}", sensorContainerClass, sensorName]
           },
           "onCreate.fireOnSensorDisplayContainerAppended": {
               funcName: "{that}.events.onSensorDisplayContainerAppended.fire",
               priority: "after:appendSensorDisplayContainer"
           },
           "{nexusSensorPresentationPanel}.events.onSensorRemoval": {
              funcName: "gpii.nexusSensorPresentationPanel.checkForRemoval",
              args: ["{that}", "{that}.sensor", "{arguments}.0"],
              namespace: "removeSensorPresenter-"+sensorId
          },
           "onDestroy.removeSensorDisplayContainer": {
               funcName: "gpii.nexusSensorPresentationPanel.removeSensorDisplayContainer",
               args: ["{nexusSensorPresentationPanel}", sensorContainerClass]
           }
        };

        return sensorListenerOptions;
    };

    gpii.nexusSensorPresentationPanel.addSensorDisplayContainer = function (nexusSensorPresentationPanel, sensorContainerClass, sensorName) {
        var attachedContainers = nexusSensorPresentationPanel.attachedContainers;

        attachedContainers.push ({"sensorName": sensorName, "containerClass": sensorContainerClass});

        // A-Z sort on sensor name
        var compare = function (containerInfoA, containerInfoB) {
            return containerInfoA.sensorName.localeCompare(containerInfoB.sensorName);
        };

        attachedContainers.sort(compare);

        var attachedContainerIndex = attachedContainers.findIndex(function (container) {
            return container.sensorName === sensorName;
        });

        // Prepend if 0 (right at start)
        if(attachedContainerIndex === 0) {
            nexusSensorPresentationPanel.container.prepend("<div class='nexus-nexusSensorPresentationPanel-sensorDisplay " + sensorContainerClass + "'></div>");
        // Append after previous container that already exists
        } else {
            var previousSiblingContainer = nexusSensorPresentationPanel.container.find("." + attachedContainers[attachedContainerIndex-1].containerClass);
            previousSiblingContainer.after("<div class='nexus-nexusSensorPresentationPanel-sensorDisplay " + sensorContainerClass + "'></div>");
        }
    };

    // Function used by the nexusSensorPresentationPanel to remove
    // dynamically generated container markup when a sensor is
    // removed
    gpii.nexusSensorPresentationPanel.removeSensorDisplayContainer = function (nexusSensorPresentationPanel, sensorContainerClass) {

        // Remove from the attached containers index
        var attachedContainers = nexusSensorPresentationPanel.attachedContainers;
        fluid.remove_if(attachedContainers, function (containerInfo) {
            console.log(containerInfo);
            return containerInfo.containerClass === sensorContainerClass;
        });
        console.log(attachedContainers);

        console.log(nexusSensorPresentationPanel, sensorContainerClass);
        var removedSensorContainer = nexusSensorPresentationPanel.container.find("." + sensorContainerClass);
        console.log(removedSensorContainer);
        removedSensorContainer.fadeOut(function() {
            removedSensorContainer.remove();
        });
    };

    // Function used by a sensorPresenter to check the array of
    // removed sensor IDs and invoke its own destroy function
    // if it matches a removed sensor ID
    gpii.nexusSensorPresentationPanel.checkForRemoval = function (sensorPresenter, sensor, removedSensorIds) {
        console.log("gpii.nexusSensorPresentationPanel.checkForRemoval");
        console.log(sensorPresenter, sensor, removedSensorIds);
        console.log(sensorPresenter);
        if(fluid.contains(removedSensorIds,fluid.get(sensor.model, "sensorId"))) {
            console.log("this sensorPresenter should be removed");
            sensorPresenter.destroy();
            console.log(sensorPresenter);
        }
    };

    // Mix-in grade for viewComponents - start hidden, then fade in
    fluid.defaults("gpii.nexusSensorPresentationPanel.fadeInPresenter", {
        listeners: {
            // Start hidden
            "onCreate.hideContainer": {
                "this": "{that}.container",
                "method": "hide",
                "args": [0]
            },
            // Fade in
            "onCreate.fadeInContainer": {
                "this": "{that}.container",
                "method": "fadeIn"
            }
        }
    });

}());
