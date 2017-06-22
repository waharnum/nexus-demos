(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

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
            sensor: {
                options: {
                    gradeNames: ["gpii.nexusSensorVisualizer.sensorPercentage"]
                }
            },
            visualizer: {
                type: "gpii.nexusSensorVisualizer.circleRadius.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.circleRadius.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter",  "gpii.nexusVisualizerBase"],
        selectors: {
            sensorValueIndicator: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-circle"
        },
        modelListeners: {
            "{sensor}.model.sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization",
                args: ["{that}", "{change}"]
            }
        },
        invokers: {
            createVisualizer: {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.visualizer.createVisualizer",
                args: ["{that}", "{sensor}.model.sensorPercentage"]
            }
        }
    });

    gpii.nexusSensorVisualizer.circleRadius.visualizer.createVisualizer = function (that, initialSensorValue) {
        var svg = that.svg;

        // Background circle
        svg.append("circle")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-circleOutline",
                cx: "100",
                cy: "100",
                r: "100",
                fill: "red"
            });

        // Indicator circle
        that.sensorValueIndicator = svg.append("circle")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-circle",
                cx: "100",
                cy: "100",
                r: initialSensorValue,
                fill: "black"
            });
    };

    gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization = function (visualizer, change) {
        var circle = visualizer.sensorValueIndicator;
        circle
        .transition()
        .duration(1000)
        .attr("r", change.value)
        .each("end", function() {
            visualizer.events.onUpdateCompleted.fire();
        });
    };

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            sensor: {
                options: {
                    gradeNames: ["gpii.nexusSensorVisualizer.sensorPercentage"]
                }
            },
            visualizer: {
                type: "gpii.nexusSensorVisualizer.horizontalBar.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusVisualizerBase"],
        selectors: {
            sensorValueIndicator: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-bar"
        },
        modelListeners: {
            "{sensor}.model.sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization",
                args: ["{that}", "{change}"]
            }
        },
        invokers: {
            createVisualizer: {
                funcName: "gpii.nexusSensorVisualizer.horizontalBar.visualizer.createVisualizer",
                args: ["{that}", "{sensor}.model.sensorPercentage"]
            }
        }
    });

    gpii.nexusSensorVisualizer.horizontalBar.visualizer.createVisualizer = function (that, initialValue) {
        var svg = that.svg;

        svg.append("rect")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-barBackground",
                width: "200",
                height: "100",
                fill: "red"
            });

        that.sensorValueIndicator = svg.append("rect")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-bar",
                width: initialValue * 2,
                height: "100",
                fill: "blue"
            });
    };

    gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization = function (visualizer, change) {
        console.log(change.value);
        var bar = visualizer.sensorValueIndicator;

        bar
        .transition()
        .duration(1000)
        .attr("width", change.value * 2)
        .each("end", function() {
            visualizer.events.onUpdateCompleted.fire();
        });
    };
}());
