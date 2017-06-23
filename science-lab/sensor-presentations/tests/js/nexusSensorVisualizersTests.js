/* global fluid, jqUnit */

(function () {

    "use strict";

    fluid.defaults("gpii.tests.visualizerTestsBase", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            visualizerTester: {
                type: "gpii.tests.visualizerTester"
            },
            sensorVisualizer: {
                createOnEvent: "{visualizerTester}.events.onTestCaseStart",
                options: {
                    gradeNames: ["gpii.tests.testVisualizerBase"]
                }
            }
        }
    });

    fluid.defaults("gpii.tests.testVisualizerBase", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            sensor: {
                type: "fluid.modelComponent",
                options: {
                    model: {
                        sensorValue: 50,
                        sensorMax: 100,
                        sensorMin: 0,
                        description: "A fake sensor"
                    }
                }
            },
            visualizer: {
                createOnEvent: "{testVisualizerBase}.events.onCreate",
                options: {
                    visualizerOptions: {
                        transitionDuration: 100
                    }
                }
                // Must be specified
                // container: ""
            }
        }
    });

    gpii.tests.generateVisualizerIndicatorTestSequence = function(testSpec) {
        var sequence = [];

        fluid.each(testSpec.sequence, function (sequenceItem) {
            var applier = {
                func: "{sensorVisualizer}.sensor.applier.change",
                args: ["sensorValue", sequenceItem.sensorValue]
            };

            var listener = {
                event: "{sensorVisualizer}.visualizer.events.onUpdateCompleted",
                listener: "gpii.tests.verifyIndicator",
                args: ["{sensorVisualizer}.visualizer.dom.sensorValueIndicator", testSpec.checkAttribute, sequenceItem.attributeValue]
            };

            sequence.push(applier, listener);
        });
        return sequence;
    };

    fluid.defaults("gpii.tests.realTimeVisualizerTests", {
        gradeNames: ["gpii.tests.visualizerTestsBase"],
        components: {
            visualizerTester: {
                type: "gpii.tests.realTimeVisualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.nexusSensorVisualizer.realTimeScale",
                options: {
                    components: {
                        visualizer: {
                            container: "#visualizer-realTimeScale"
                        }
                    }
                }
            }
        }
    });

    gpii.tests.realTimeVisualizerTestSequence = {
            checkAttribute: "height",
            // Left: sensor value change (num)
            // Right: expected corresponding change to
            // indicator attribute (string)
            sequence: [
                {
                    sensorValue: 50,
                    attributeValue: "230"
                },
                {
                    sensorValue: 75,
                    attributeValue: "345"
                },
                {
                    sensorValue: 25,
                    attributeValue: "115"
                },
                {
                    sensorValue: 100,
                    attributeValue: "460"
                }
            ]
    };

    fluid.defaults("gpii.tests.realTimeVisualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test real-time visualizer",
            tests: [{
                name: "Test indicator response to sensor model changes",
                expect: 4,
                sequence: gpii.tests.generateVisualizerIndicatorTestSequence(gpii.tests.realTimeVisualizerTestSequence)
            }]
        }]
    });

    fluid.defaults("gpii.tests.circularPercentageScaleVisualizerTests", {
        gradeNames: ["gpii.tests.visualizerTestsBase"],
        components: {
            visualizerTester: {
                type: "gpii.tests.circularPercentageScaleVisualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.nexusSensorVisualizer.circleRadius",
                options: {
                    components: {
                        visualizer: {
                            container: "#visualizer-circularPercentageScale"
                        }
                    }
                }
            }
        }
    });

    gpii.tests.circularPercentageScaleVisualizerTestSequence = {
            checkAttribute: "r",
            sequence: [
                {
                    sensorValue: 50,
                    attributeValue: "50"
                },
                {
                    sensorValue: 25,
                    attributeValue: "25"
                },
                {
                    sensorValue: 75,
                    attributeValue: "75"
                },
                {
                    sensorValue: 100,
                    attributeValue: "100"
                }
            ]
    };

    fluid.defaults("gpii.tests.circularPercentageScaleVisualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test circular percentage scale visualizer",
            tests: [{
                name: "Test indicator response to sensor model changes",
                expect: 4,
                sequence: gpii.tests.generateVisualizerIndicatorTestSequence(gpii.tests.circularPercentageScaleVisualizerTestSequence)
            }]
        }]
    });

    fluid.defaults("gpii.tests.horizontalBarPercentageScaleVisualizerTests", {
        gradeNames: ["gpii.tests.visualizerTestsBase"],
        components: {
            visualizerTester: {
                type: "gpii.tests.horizontalBarPercentageScaleVisualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.nexusSensorVisualizer.horizontalBar",
                options: {
                    components: {
                        visualizer: {
                            container: "#visualizer-horizontalBarPercentageScale"
                        }
                    }
                }
            }
        }
    });

    gpii.tests.horizontalBarPercentageScaleVisualizerTestSequence = {
            checkAttribute: "width",
            sequence: [
                {
                    sensorValue: 50,
                    attributeValue: "100"
                },
                {
                    sensorValue: 25,
                    attributeValue: "50"
                },
                {
                    sensorValue: 75,
                    attributeValue: "150"
                },
                {
                    sensorValue: 100,
                    attributeValue: "200"
                }
            ]
    };

    fluid.defaults("gpii.tests.horizontalBarPercentageScaleVisualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test horizontal bar percentage scale visualizer",
            tests: [{
                name: "Test indicator response to sensor model changes",
                expect: 4,
                sequence: gpii.tests.generateVisualizerIndicatorTestSequence(gpii.tests.horizontalBarPercentageScaleVisualizerTestSequence)
            }]
        }]
    });

    fluid.defaults("gpii.tests.colorScaleVisualizerTests", {
        gradeNames: ["gpii.tests.visualizerTestsBase"],
        components: {
            visualizerTester: {
                type: "gpii.tests.colorScaleVisualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.nexusSensorVisualizer.colorScale",
                options: {
                    components: {
                        visualizer: {
                            container: "#visualizer-colorScale",
                            options: {
                                scaleOptions: {
                                    colors: ["#FF0000","#00FF00", "#0000FF"]
                                }

                            }
                        }
                    }
                }
            }
        }
    });

    gpii.tests.colorScaleVisualizerTestSequence = {
            checkAttribute: "transform",
            sequence: [
                {
                    sensorValue: 50,
                    attributeValue: "translate(40,235)"
                },
                {
                    sensorValue: 25,
                    attributeValue: "translate(40,350)"
                },
                {
                    sensorValue: 75,
                    attributeValue: "translate(40,120)"
                },
                {
                    sensorValue: 100,
                    attributeValue: "translate(40,5)"
                }
            ]
    };

    fluid.defaults("gpii.tests.colorScaleVisualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test color scale visualizer",
            tests: [{
                name: "Test indicator response to sensor model changes",
                expect: 4,
                sequence: gpii.tests.generateVisualizerIndicatorTestSequence(gpii.tests.colorScaleVisualizerTestSequence)
            },{
                name: "Test color scale generation",
                expect: 3,
                sequence: [
                    {
                        func: "gpii.tests.verifyColorScaleGeneration",
                        args: ["{sensorVisualizer}"]
                    }
                ]
            }]
        }]
    });

    gpii.tests.verifyColorScaleGeneration = function (sensorVisualizer) {
        var colors = sensorVisualizer.visualizer.options.scaleOptions.colors;
        // ["#FF0000", "#00FF00", "#0000FF"]
        var colorBars = sensorVisualizer.visualizer.locate("colorBars");

        fluid.each(colors, function (currentColor, idx) {
            var message = fluid.stringTemplate("Color bar at position %idx is expected value of %color", {color: currentColor, idx: idx});
            var currentBar = colorBars[idx];
            jqUnit.assertEquals(message, currentColor, $(currentBar).attr("fill"));
        });

    };

    fluid.defaults("gpii.tests.lineChartVisualizerTests", {
        gradeNames: ["gpii.tests.visualizerTestsBase"],
        components: {
            visualizerTester: {
                type: "gpii.tests.lineChartVisualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.nexusSensorVisualizer.lineChart",
                options: {
                    components: {
                        visualizer: {
                            container: "#visualizer-lineChart"
                        },
                        sensorValueAccumulator: {
                            options: {
                                model: {
                                    maxValuesRetained: 5
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // First value is 50, it should get popped
    // off after the final change because the
    // maxValuesRetained is set to 5
    gpii.tests.lineChartAccumulatorExpectedValues = [
            [50, 25],
            [50, 25, 35],
            [50, 25, 35, 45],
            [50, 25, 35, 45, 55],
            [25, 35, 45, 55, 65]
    ];

    fluid.defaults("gpii.tests.lineChartVisualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test line chart visualizer",
            tests: [{
                name: "Test line chart sensor value accumulator",
                expect: 19,
                sequence: [
                    {
                        func: "{sensorVisualizer}.sensor.applier.change",
                        args: ["sensorValue", 25]
                    },
                    {
                        func: "gpii.tests.verifyLineChartSensorValueAccumulation",
                        args: ["{sensorVisualizer}.sensorValueAccumulator", gpii.tests.lineChartAccumulatorExpectedValues[0]]
                    },
                    {
                        func: "{sensorVisualizer}.sensor.applier.change",
                        args: ["sensorValue", 35]
                    },
                    {
                        func: "gpii.tests.verifyLineChartSensorValueAccumulation",
                        args: ["{sensorVisualizer}.sensorValueAccumulator", gpii.tests.lineChartAccumulatorExpectedValues[1]]
                    },
                    {
                        func: "{sensorVisualizer}.sensor.applier.change",
                        args: ["sensorValue", 45]
                    },
                    {
                        func: "gpii.tests.verifyLineChartSensorValueAccumulation",
                        args: ["{sensorVisualizer}.sensorValueAccumulator", gpii.tests.lineChartAccumulatorExpectedValues[2]]
                    },
                    {
                        func: "{sensorVisualizer}.sensor.applier.change",
                        args: ["sensorValue", 55]
                    },
                    {
                        func: "gpii.tests.verifyLineChartSensorValueAccumulation",
                        args: ["{sensorVisualizer}.sensorValueAccumulator", gpii.tests.lineChartAccumulatorExpectedValues[3]]
                    },
                    {
                        func: "{sensorVisualizer}.sensor.applier.change",
                        args: ["sensorValue", 65]
                    },
                    {
                        func: "gpii.tests.verifyLineChartSensorValueAccumulation",
                        args: ["{sensorVisualizer}.sensorValueAccumulator", gpii.tests.lineChartAccumulatorExpectedValues[4]]
                    }
                ]
            }]
        }]
    });

    gpii.tests.verifyLineChartSensorValueAccumulation = function(accumulator, expected) {
        fluid.each(expected, function (expectedValue, idx) {
            var message = fluid.stringTemplate("Accumulator value at position %idx is expected value of %value", {idx: idx, value: accumulator.model.sensorValues[idx].value});
            jqUnit.assertEquals(message, expectedValue, accumulator.model.sensorValues[idx].value);
        });
    };

    gpii.tests.verifyIndicator = function (indicator, checkAttribute, expectedValue) {
        var message = fluid.stringTemplate("Attribute '%checkAttribute' is expected value of %expectedValue", {checkAttribute: checkAttribute, expectedValue: expectedValue});
        jqUnit.assertEquals(message, expectedValue, indicator.attr(checkAttribute));
    };

    gpii.tests.realTimeVisualizerTests();
    gpii.tests.circularPercentageScaleVisualizerTests();
    gpii.tests.horizontalBarPercentageScaleVisualizerTests();
    gpii.tests.colorScaleVisualizerTests();
    gpii.tests.lineChartVisualizerTests();

}());
