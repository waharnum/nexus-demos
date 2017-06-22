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
                        description: "A sensor"
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

    fluid.defaults("gpii.tests.realTimeVisualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test real-time visualizer",
            tests: [{
                name: "Test indicator response to sensor model changes",
                expect: 2,
                sequence: [
                    {
                        func: "gpii.tests.verifyIndicator",
                        args: ["{sensorVisualizer}.visualizer.dom.sensorValueIndicator", "height", "230"]
                    },
                    {
                        func: "{sensorVisualizer}.sensor.applier.change",
                        args: ["sensorValue", 75]
                    },
                    {
                        event: "{sensorVisualizer}.visualizer.events.onUpdateCompleted",
                        listener: "gpii.tests.verifyIndicator",
                        args: ["{sensorVisualizer}.visualizer.dom.sensorValueIndicator", "height", "345"]
                    }

                ]
            }]
        }]
    });

    fluid.defaults("gpii.tests.testRealTimeVisualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.realTimeScale", "gpii.tests.testVisualizerBase"],
        components: {
            visualizer: {
                container: "#visualizer-realTimeScale"
            }
        }
    });

    gpii.tests.verifyIndicator = function (indicator, checkAttribute, expectedValue) {
        var message = fluid.stringTemplate("Attribute '%checkAttribute' is expected value of %expectedValue", {checkAttribute: checkAttribute, expectedValue: expectedValue});
        jqUnit.assertEquals(message, expectedValue, indicator.attr(checkAttribute));
    };

    gpii.tests.realTimeVisualizerTests();

}());
