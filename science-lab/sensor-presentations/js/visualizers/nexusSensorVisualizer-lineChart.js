(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

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
                    }
                }
            },
            sensorValueAccumulator: {
                type: "fluid.modelComponent",
                options: {
                    model: {
                        sensorValues: [],
                        maxValuesRetained: 50
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.lineChart.accumulateSensorValues = function (sensorValueAccumulator, visualizer, change) {

        var maxValuesRetained = fluid.get(sensorValueAccumulator.model, "maxValuesRetained");

        var currentSensorValues = fluid.copy(fluid.get(sensorValueAccumulator.model, "sensorValues"));
        var currentTime = new Date();

        if(currentSensorValues.length >= maxValuesRetained) {
            currentSensorValues.shift();
        }

        var sensorRecord = {
            "date": currentTime,
            "value": change.value
        };

        currentSensorValues.push(sensorRecord);

        sensorValueAccumulator.applier.change("sensorValues", currentSensorValues);

        visualizer.applier.change("dataSet", currentSensorValues);
    };

    fluid.defaults("gpii.nexusSensorVisualizer.lineChart.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "floe.chartAuthoring.lineChart.timeSeriesSingleDataSet", "gpii.nexusVisualizerBase"],
        events: {
            onUpdateCompleted: null
        },
        invokers: {
            transitionChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine.defaultTransition"
            },
            // Line chart component does this itself
            createVisualizer: {
                funcName: "fluid.identity"
            },
            updateVisualizer: {
                funcName: "gpii.nexusSensorVisualizer.lineChart.accumulateSensorValues",
                args: ["{sensorValueAccumulator}", "{arguments}.0", "{arguments}.1"]
            }
        },
        // Line chart component does this itself
        listeners: {
            "onCreate.createBaseSVGDrawingArea": {
                funcName: "fluid.identity"
            }
        }
    });

}());
