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
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "floe.chartAuthoring.lineChart.timeSeriesSingleDataSet"],
        listeners: {
            "onCreate.prependSensorTitle": {
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

}());
