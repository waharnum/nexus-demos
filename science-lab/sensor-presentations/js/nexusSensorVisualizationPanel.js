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
                    "onCreate.appendSensorDisplayContainer": {
                        "this": "{nexusSensorVisualizationPanel}.container",
                        method: "append",
                        "args": ["<div class='nexus-nexusSensorVisualizationPanel-sensorDisplay " + sensorContainerClass + "'></div>"]
                    },
                    "onCreate.fireOnSensorDisplayContainerAppended": {
                        funcName: "{that}.events.onSensorDisplayContainerAppended.fire",
                        priority: "after:appendSensorDisplayContainer"
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
                    modelRelay: [{
                        target: "circleRadius",
                        singleTransform: {
                            type: "gpii.sensorPlayer.transforms.minMaxScale",
                            input: "{sensor}.model.sensorValue",
                            inputScaleMax: "{sensor}.model.sensorMax",
                            inputScaleMin: "{sensor}.model.sensorMin",
                            outputScaleMax: 100,
                            outputScaleMin: 0
                        }
                    }],
                    selectors: {
                        circle: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-circle"
                    },
                    model: {
                        circleRadius: 0
                    },
                    modelListeners: {
                        "circleRadius": {
                            funcName: "gpii.nexusSensorVisualizer.updateVisualization",
                            args: ["{that}", "{change}"]
                        }
                    },
                    listeners: {
                        "onCreate.announce": {
                            "this": "console",
                            method: "log",
                            args: "{that}"
                        },
                        "onCreate.appendCircle": {
                            "this": "{that}.container",
                            method: "html",
                            args: {
                            expander: {
                                    funcName: "fluid.stringTemplate",
                                    args: ["<h2>%description</h2> <br/> <svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-circleOutline\" cx=\"100\" cy=\"100\" r=\"100\" fill=\"red\" /><circle class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-circle\" cx=\"100\" cy=\"100\" r=\"0\" /></svg>", "{sensor}.model"]
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("circle");
        circle.attr("r", change.value);
    };

}());
