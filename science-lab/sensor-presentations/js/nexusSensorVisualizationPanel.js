(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    // Sonification presentation panel
    fluid.defaults("gpii.nexusSensorVisualizationPanel", {
        gradeNames: ["gpii.nexusSensorPresentationPanel"],
        // Key-value pairs of sensorIds / sensorPresenter grades
        perSensorPresentationGrades: {
            "fakeSensor": "gpii.nexusSensorVisualizer.colorScale",
            "fakeSensorPH": "gpii.nexusSensorVisualizer.pHScale",
            "phSensor": "gpii.nexusSensorVisualizer.pHScale"
        },
        defaultSensorPresentationGrade: "gpii.nexusSensorVisualizer.realTimeScale",
        dynamicComponents: {
            sensorPresenter: {
                type: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterType({that}, {arguments}.0)",
                createOnEvent: "onSensorAppearance",
                options: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions({arguments}.0)"
            }
        }
    });

    gpii.nexusSensorVisualizationPanel.getSensorPresenterType = function (that, sensorId) {
        var perSensorPresentationGrades = that.options.perSensorPresentationGrades;
        if(perSensorPresentationGrades[sensorId]) {
            return perSensorPresentationGrades[sensorId];
        } else {
            return that.options.defaultSensorPresentationGrade;
        }
    };

    gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions = function (sensorId) {

        var sensorModelOptions = gpii.nexusSensorPresentationPanel.getSensorModelOptions(sensorId);

        var sensorContainerClass = "nexus-nexusSensorVisualizationPanel-sensorDisplay-" + sensorId;

        var sensorVisualizerListenerOptions = gpii.nexusSensorPresentationPanel.getSensorPresenterListenerOptions(sensorId, sensorContainerClass);

        var sensorVisualizerOptions = {
                events: {
                    onSensorDisplayContainerAppended: null
                },
                listeners: sensorVisualizerListenerOptions,
                components: {
                    sensor: {
                        options: {
                            model: sensorModelOptions
                        }
                    },
                    visualizer: {
                        container: "." + sensorContainerClass
                    }
                }
        };

        return sensorVisualizerOptions;
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
