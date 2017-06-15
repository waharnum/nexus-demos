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
                type: "gpii.tests.visualizerTester"
            },
            sensorVisualizer: {
                type: "gpii.tests.testRealTimeVisualizer",
                createOnEvent: "{visualizerTester}.events.onTestCaseStart"
            }
        }
    });

    fluid.defaults("gpii.tests.visualizerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test real-time visualizer",
            tests: [{
                name: "Test presentation panel sensor create and remove behaviour",
                expect: 1,
                sequence: [{
                    func: "gpii.tests.verifyIndicator",
                    args: ["{sensorVisualizer}.visualizer.dom.sensorValueIndicator", "height", "230"]
                }]
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

    gpii.tests.mockSensorVisualizerFactory = function (sensorVisualizerGrade, visualizerContainer, visualizerOptions) {

        return sensorVisualizerGrade({
            gradeNames: ["gpii.tests.testVisualizerBase"],
            components: {
                visualizer: {
                    container: visualizerContainer,
                    options: visualizerOptions
                }
            }
        });
    };

    gpii.tests.verifyIndicator = function (indicator, checkAttribute, expectedValue) {
        var message = fluid.stringTemplate("Attribute '%checkAttribute' is expected value of %expectedValue", {checkAttribute: checkAttribute, expectedValue: expectedValue});
        jqUnit.assertEquals(message, expectedValue, indicator.attr(checkAttribute));
    };

    gpii.tests.realTimeVisualizerTests();

    // jqUnit.test("Test real-time scale", function() {
    //     var realTimeScale = gpii.tests.testRealTimeVisualizer();
    //     console.log(realTimeScale);
    //
    //     gpii.tests.verifyIndicator(realTimeScale.visualizer.locate("sensorValueIndicator"), "height", "230");
    //
    //     realTimeScale.sensor.applier.change("sensorValue", 100);
    //
    //     gpii.tests.verifyIndicator(realTimeScale.visualizer.locate("sensorValueIndicator"), "height", "460");
    //
    // });
    //
    // jqUnit.test("Test color scale", function() {
    //     var colorScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.colorScale, "#visualizer-colorScale", {scaleOptions: {colors: ["#FF0000","#00FF00", "#0000FF"]}});
    //
    //     gpii.tests.verifyIndicator(colorScale.visualizer.locate("indicator"), "transform", "translate(40, 235)");
    // });

}());
