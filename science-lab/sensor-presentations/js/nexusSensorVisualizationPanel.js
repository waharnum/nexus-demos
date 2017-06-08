(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    // Sonification presentation panel
    fluid.defaults("gpii.nexusSensorVisualizationPanel", {
        gradeNames: ["gpii.nexusSensorPresentationPanel"],
        // Key-value pairs of sensorIds / sensorPresenter grades
        perSensorPresentationGrades: {
            "fakeSensorPH": "gpii.nexusSensorVisualizer.pHScale",
            "fakeSensorTemperature": "gpii.nexusSensorVisualizer.temperature",
            "rpiTempSensor1": "gpii.nexusSensorVisualizer.temperature",
            "rpiTempSensor2": "gpii.nexusSensorVisualizer.temperature",
            "phSensor": "gpii.nexusSensorVisualizer.pHScale"
        },
        dynamicComponentContainerOptions: {
            // fluid.stringTemplate
            containerIndividualClassTemplate: "nexus-nexusSensorSonificationPanel-sensorDisplay-%sensorId"
        },
        defaultSensorPresentationGrade: "gpii.nexusSensorVisualizer.realTimeScale",
        invokers: {
            "generatePresenterOptionsBlock": {
                funcName: "gpii.nexusSensorVisualizationPanel.getSensorPresenterOptionsBlock",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2"]
            }
        }
    });

    gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions = function (sensorId, sensorName, sensorPresentationPanel) {

        var sensorPresenterModelOptions = gpii.nexusSensorPresentationPanel.getSensorModelOptions(sensorId);

        var sensorPresenterContainerClass = fluid.stringTemplate(sensorPresentationPanel.options.dynamicComponentContainerOptions.containerIndividualClassTemplate, {sensorId: sensorId});

        var sensorPresenterListenerOptions = gpii.nexusSensorPresentationPanel.getSensorPresenterListenerOptions(sensorId, sensorPresenterContainerClass, sensorName);

        return sensorPresentationPanel.generatePresenterOptionsBlock(sensorPresenterModelOptions, sensorPresenterListenerOptions, sensorPresenterContainerClass);
    };

    gpii.nexusSensorVisualizationPanel.getSensorPresenterOptionsBlock = function (sensorPresenterModelOptions, sensorPresenterListenerOptions, sensorPresenterContainerClass) {
        var optionsBlock = {
                events: {
                    onSensorDisplayContainerAppended: null
                },
                listeners: sensorPresenterListenerOptions,
                components: {
                    sensor: {
                        options: {
                            model: sensorPresenterModelOptions
                        }
                    },
                    visualizer: {
                        container: "." + sensorPresenterContainerClass
                    }
                }
        };

        return optionsBlock;
    };

    // Abstract grade used by visualizers
    fluid.defaults("gpii.nexusSensorVisualizerBase", {
        gradeNames: ["fluid.component"],
        events: {
            onSensorDisplayContainerAppended: null
        },
        components: {
            sensor: {
                type: "fluid.modelComponent"
            },
            visualizer: {
                createOnEvent: "{nexusSensorVisualizerBase}.events.onSensorDisplayContainerAppended"
                // Must be specified; handled by dynamicComponents behaviour
                // container: ""
            }
        }
    });

}());
