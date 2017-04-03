(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    // Sonification presentation panel
    fluid.defaults("gpii.nexusSensorVisualizationPanel", {
        gradeNames: ["gpii.nexusSensorPresentationPanel"],
        // Key-value pairs of sensorIds / sensorPresenter grades
        perSensorPresentationTypes: {
            "fakeSensor": "gpii.nexusSensorVisualizer.circleRadius"
        },
        dynamicComponents: {
            sensorPresenter: {
                type: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterType({that}, {arguments}.0)",
                createOnEvent: "onSensorAppearance",
                options: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions({arguments}.0)"
            }
        }
    });

    gpii.nexusSensorVisualizationPanel.getSensorPresenterType = function (that, sensorId) {
        var perSensorPresentationTypes = that.options.perSensorPresentationTypes;
        if(perSensorPresentationTypes[sensorId]) {
            return perSensorPresentationTypes[sensorId];
        } else {
            return "gpii.nexusSensorVisualizer.lineChart";
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

    // Abstract grade
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

    fluid.defaults("gpii.nexusSensorVisualizer.lineChart", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.lineChart.visualizer",
                options: {
                    scaleOptions: {
                        // transform rules to apply to yScale min
                        yScaleMinTransform: {
                            "literalValue": "{sensor}.model.sensorMin"
                        },
                        // transform rules to apply to yScale max
                        yScaleMaxTransform: {
                            "literalValue": "{sensor}.model.sensorMax"
                        }
                    },
                    modelListeners: {
                        "{sensor}.model.sensorValue": {
                            func: "gpii.nexusSensorVisualizer.lineChart.accumulateSensorValues",
                            args: ["{sensorValueAccumulator}", "{visualizer}", "{change}"]
                        }
                    }
                }
            },
            sensorValueAccumulator: {
                type: "fluid.modelComponent",
                options: {
                    model: {
                        sensorValues: []
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.lineChart.accumulateSensorValues = function (sensorValueAccumulator, visualizer, change) {
        var currentSensorValues = fluid.copy(fluid.get(sensorValueAccumulator.model, "sensorValues"));
        var currentTime = new Date();

        var sensorRecord = {
            "date": currentTime,
            "value": change.value
        };

        currentSensorValues.push(sensorRecord);

        sensorValueAccumulator.applier.change("sensorValues", null, "DELETE");

        sensorValueAccumulator.applier.change("sensorValues", currentSensorValues);

        visualizer.applier.change("dataSet", currentSensorValues);
    };

    fluid.defaults("gpii.nexusSensorVisualizer.lineChart.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "floe.chartAuthoring.lineChart.timeSeriesSingleDataSet"],
        listeners: {
            "onCreate.appendSensorTitle": {
                "this": "{that}.container",
                method: "prepend",
                args: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["<h2>%description</h2>", "{sensor}.model"]
                    }
                }
            }
        },
        invokers: {
            transitionChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine.defaultTransition"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.sensorPercentage", {
        gradeNames: ["fluid.modelComponent"],
        modelRelay: [{
            target: "sensorPercentage",
            singleTransform: {
                type: "gpii.sensorPlayer.transforms.minMaxScale",
                input: "{sensor}.model.sensorValue",
                inputScaleMax: "{sensor}.model.sensorMax",
                inputScaleMin: "{sensor}.model.sensorMin",
                outputScaleMax: 100,
                outputScaleMin: 0
            }
        }]
    });

    fluid.defaults("gpii.nexusSensorVisualizer.circleRadius", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.circleRadius.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.circleRadius.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusSensorVisualizer.sensorPercentage", "fluid.viewComponent"],
        selectors: {
            circle: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-circle"
        },
        modelListeners: {
            "sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization",
                args: ["{that}", "{change}"]
            }
        },
        listeners: {
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
    });

    gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("circle");
        circle.animate({"r": change.value}, 500);
    };

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.horizontalBar.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusSensorVisualizer.sensorPercentage", "fluid.viewComponent"],
        selectors: {
            bar: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-bar"
        },
        modelListeners: {
            "sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization",
                args: ["{that}", "{change}"]
            }
        },
        listeners: {
            "onCreate.appendBar": {
                "this": "{that}.container",
                method: "html",
                args: {
                expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["<h2>%description</h2> <br/> <svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><rect class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-barBackground\" width=\"200\" height=\"100\" fill=\"red\" /><rect class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-bar\" width=\"0\" height=\"100\" fill=\"blue\" /></svg>", "{sensor}.model"]
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("bar");
        circle.animate({"width": change.value * 2}, 500);
    };

}());
