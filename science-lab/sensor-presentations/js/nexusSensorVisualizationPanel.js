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

    fluid.defaults("gpii.nexusSensorVisualizer", {
        gradeNames: ["fluid.component"],
        events: {
            onSensorDisplayContainerAppended: null
        },
        components: {
            sensor: {
                type: "fluid.modelComponent"
            },
            visualizer: {
                type: "gpii.nexusSensorVisualizer.lineChart",
                createOnEvent: "{nexusSensorVisualizer}.events.onSensorDisplayContainerAppended"
                // Must be specified
                // container: ""
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
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusSensorVisualizer.sensorPercentage", "fluid.viewComponent"],
        selectors: {
            circle: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-circle"
        },
        modelListeners: {
            "sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.updateVisualization",
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

    gpii.nexusSensorVisualizer.circleRadius.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("circle");
        circle.animate({"r": change.value}, 500);
    };

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusSensorVisualizer.sensorPercentage", "fluid.viewComponent"],
        selectors: {
            bar: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-bar"
        },
        modelListeners: {
            "sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.horizontalBar.updateVisualization",
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

    gpii.nexusSensorVisualizer.horizontalBar.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("bar");
        circle.animate({"width": change.value * 2}, 500);
    };

    var dataSet = [
    {
        "date": "2014-12-31",
        "value": 45
    },
    {
        "date": "2015-01-07",
        "value": 24
    },
    {
        "date": "2015-01-14",
        "value": 31
    },
    {
        "date": "2015-01-21",
        "value": 36
    },
    {
        "date": "2015-01-28",
        "value": 40
    },
    {
        "date": "2015-02-04",
        "value": 14
    },
    {
        "date": "2015-02-11",
        "value": 12
    },
    {
        "date": "2015-02-18",
        "value": 8
    },
    {
        "date": "2015-02-25",
        "value": 49
    },
    {
        "date": "2015-03-04",
        "value": 6
    },
    {
        "date": "2015-03-11",
        "value": 31
    },
    {
        "date": "2015-03-18",
        "value": 11
    },
    {
        "date": "2015-03-25",
        "value": 46
    },
    {
        "date": "2015-04-01",
        "value": 7
    },
    {
        "date": "2015-04-08",
        "value": 5
    },
    {
        "date": "2015-04-15",
        "value": 33
    },
    {
        "date": "2015-04-22",
        "value": 12
    },
    {
        "date": "2015-04-29",
        "value": 35
    },
    {
        "date": "2015-05-06",
        "value": 17
    },
    {
        "date": "2015-05-13",
        "value": 23
    },
    {
        "date": "2015-05-20",
        "value": 45
    },
    {
        "date": "2015-05-27",
        "value": 7
    },
    {
        "date": "2015-06-03",
        "value": 25
    },
    {
        "date": "2015-06-10",
        "value": 18
    },
    {
        "date": "2015-06-17",
        "value": 19
    },
    {
        "date": "2015-06-24",
        "value": 45
    }
];

    fluid.defaults("gpii.nexusSensorVisualizer.lineChart", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "floe.chartAuthoring.lineChart.timeSeriesSingleDataSet"],
        model: {
            dataSet: dataSet
        }
    });

}());
