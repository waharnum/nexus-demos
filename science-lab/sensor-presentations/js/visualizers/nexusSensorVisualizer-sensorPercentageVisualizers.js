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
        svgOptions: {
            height: 200,
            width: 200
        },
        invokers: {
            createVisualizer: {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.visualizer.createVisualizer",
                args: ["{that}", "{sensor}.model.sensorPercentage"]
            },
            updateVisualizer: {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization"
            }
        }
    });

    gpii.nexusSensorVisualizer.circleRadius.visualizer.createVisualizer = function (that, initialSensorValue) {
        var svg = that.svg,
            height = that.options.svgOptions.height,
            width = that.options.svgOptions.width;

        // Background circle
        svg.append("circle")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-circleOutline",
                cx: width / 2,
                cy: height / 2,
                r: height / 2,
                fill: "red"
            });

        // Indicator circle
        that.sensorValueIndicator = svg.append("circle")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-circle",
                cx: width / 2,
                cy: height / 2,
                r: initialSensorValue / (height / 2),
                fill: "black"
            });
    };

    gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization = function (visualizer, change) {

        var height = visualizer.options.svgOptions.height;

        var transitionDuration = visualizer.options.visualizerOptions.transitionDuration;

        var circle = visualizer.sensorValueIndicator;
        circle
        .transition()
        .duration(transitionDuration)
        .attr("r", change.value * (height / 2 / 100))
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
        svgOptions: {
            height: 200,
            width: 200
        },
        invokers: {
            createVisualizer: {
                funcName: "gpii.nexusSensorVisualizer.horizontalBar.visualizer.createVisualizer",
                args: ["{that}", "{sensor}.model.sensorPercentage"]
            },
            updateVisualizer: {
                funcName:
                "gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization"
            }
        }
    });

    gpii.nexusSensorVisualizer.horizontalBar.visualizer.createVisualizer = function (that, initialValue) {
        var svg = that.svg,
            width = that.options.svgOptions.width,
            height = that.options.svgOptions.height;

        svg.append("rect")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-barBackground",
                width: width,
                height: height / 2,
                fill: "red"
            });

        that.sensorValueIndicator = svg.append("rect")
            .attr({
                "class": "nexus-nexusSensorVisualizationPanel-sensorDisplay-bar",
                width: initialValue * (width / 2),
                height: height / 2,
                fill: "blue"
            });
    };

    gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization = function (visualizer, change) {
        var bar = visualizer.sensorValueIndicator,
            width = visualizer.options.svgOptions.width;

        var transitionDuration = visualizer.options.visualizerOptions.transitionDuration;

        bar
        .transition()
        .duration(transitionDuration)
        .attr("width", change.value * (width / 100))
        .each("end", function() {
            visualizer.events.onUpdateCompleted.fire();
        });
    };
}());
