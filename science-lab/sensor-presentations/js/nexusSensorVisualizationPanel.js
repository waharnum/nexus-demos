(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    // Sonification presentation panel
    fluid.defaults("gpii.nexusSensorVisualizationPanel", {
        gradeNames: ["gpii.nexusSensorPresentationPanel"],
        dynamicComponents: {
            sensorPresenter: {
                type: "gpii.nexusSensorVisualizer",
                createOnEvent: "onSensorAppearance",
                options: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions({arguments}.0)"
            }
        }
    });

    gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions = function (sensorId) {
        var sensorModel = {
            sensorId: sensorId,
            description: "{nexusSensorVisualizationPanel}.model.sensors." + sensorId + ".name",
            sensorValue: "{nexusSensorVisualizationPanel}.model.sensors." + sensorId + ".value",
            sensorMax: "{nexusSensorVisualizationPanel}.model.sensors." + sensorId + ".rangeMax",
            sensorMin: "{nexusSensorVisualizationPanel}.model.sensors." + sensorId + ".rangeMin"
        };

        var sensorContainerClass = "nexus-nexusSensorVisualizationPanel-sensorDisplay-" + sensorId;

        var sensorVisualizerOptions = {
                events: {
                    onSensorDisplayContainerAppended: null
                },
                listeners: {
                    "onCreate.appendVisualizerContainerMarkup": {
                        "this": "{nexusSensorVisualizationPanel}.container",
                        method: "append",
                        "args": ["<div class='nexus-nexusSensorVisualizationPanel-sensorDisplay " + sensorContainerClass + "'></div>"]
                    },
                    "onCreate.fireOnSensorDisplayContainerAppended": {
                        funcName: "{that}.events.onSensorDisplayContainerAppended.fire",
                        priority: "after:appendVisualizerContainerMarkup"
                    }
                },
                components: {
                    sensor: {
                        options: {
                            model: sensorModel
                        }
                    },
                    visualizer: {
                        container: "." + sensorContainerClass
                    }
                }
        };

        return sensorVisualizerOptions;
    };

    fluid.defaults("gpii.nexusSensorVisualizer", {
        gradeNames: ["fluid.component"],
        events: {
            onSensorDisplayContainerAppended: null
        },
        components: {
            sensor: {
                type: "fluid.modelComponent",
                options: {
                    listeners: {
                        "onCreate.announce": {
                            "this": "console",
                            method: "log",
                            args: "{that}"
                        }
                    }
                }
            },
            visualizer: {
                type: "fluid.viewComponent",
                createOnEvent: "{nexusSensorVisualizer}.events.onSensorDisplayContainerAppended",
                // Must be specified
                // container: ""
                options: {
                    listeners: {
                        "onCreate.announce": {
                            "this": "console",
                            method: "log",
                            args: "{that}"
                        }
                    }
                }
            }
        }
    });

}());
