/* global fluid, jqUnit */

(function () {

    "use strict";

    fluid.defaults("gpii.tests.visualizerTestsBase", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            visualizerTester: {
                type: "gpii.tests.visualizerTester"
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
                createOnEvent: "{testVisualizerBase}.events.onCreate"
                // Must be specified
                // container: ""
            }
        }
    });

    fluid.defaults("gpii.tests.realTimeVisualizerTests", {
        gradeNames: ["gpii.tests.visualizerTestsBase"],
        components: {
            visualizerTester: {
                type: "gpii.tests.realTimeVisualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.tests.testRealTimeVisualizer",
                createOnEvent: "{visualizerTester}.events.onTestCaseStart"
            }
        }
    });

    fluid.defaults("gpii.tests.testRealTimeVisualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.realTimeScale", "gpii.tests.testVisualizerBase"],
        components: {
            visualizer: {
                container: "#visualizer-realTimeScale"
            }
        }
    });

    gpii.tests.generateVisualizerTestSequence = function(testSpec) {
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
                sequence: gpii.tests.generateVisualizerTestSequence(gpii.tests.realTimeVisualizerTestSequence)
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
                type: "gpii.tests.testCircularPercentageScaleVisualizer",
                createOnEvent: "{visualizerTester}.events.onTestCaseStart"
            }
        }
    });

    fluid.defaults("gpii.tests.testCircularPercentageScaleVisualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.circleRadius", "gpii.tests.testVisualizerBase"],
        components: {
            visualizer: {
                container: "#visualizer-circularPercentageScale"
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
                sequence: gpii.tests.generateVisualizerTestSequence(gpii.tests.circularPercentageScaleVisualizerTestSequence)
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
                type: "gpii.tests.testHorizontalBarPercentageScaleVisualizer",
                createOnEvent: "{visualizerTester}.events.onTestCaseStart"
            }
        }
    });

    fluid.defaults("gpii.tests.testHorizontalBarPercentageScaleVisualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.horizontalBar", "gpii.tests.testVisualizerBase"],
        components: {
            visualizer: {
                container: "#visualizer-horizontalBarPercentageScale"
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
                sequence: gpii.tests.generateVisualizerTestSequence(gpii.tests.horizontalBarPercentageScaleVisualizerTestSequence)
            }]
        }]
    });

    gpii.tests.verifyIndicator = function (indicator, checkAttribute, expectedValue) {
        var message = fluid.stringTemplate("Attribute '%checkAttribute' is expected value of %expectedValue", {checkAttribute: checkAttribute, expectedValue: expectedValue});
        jqUnit.assertEquals(message, expectedValue, indicator.attr(checkAttribute));
    };

    gpii.tests.realTimeVisualizerTests();
    gpii.tests.circularPercentageScaleVisualizerTests();
    gpii.tests.horizontalBarPercentageScaleVisualizerTests();

}());
