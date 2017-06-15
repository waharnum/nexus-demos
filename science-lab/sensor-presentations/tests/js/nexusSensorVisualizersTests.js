/* global fluid, jqUnit */

(function () {

    "use strict";

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
        console.log(indicator);
        var message = fluid.stringTemplate("Attribute '%checkAttribute' is expected value of %expectedValue", {checkAttribute: checkAttribute, expectedValue: expectedValue});
        jqUnit.assertEquals(message, expectedValue, indicator.attr(checkAttribute));
    };

    jqUnit.test("Test real-time scale", function() {
        var realTimeScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.realTimeScale, "#visualizer-realTimeScale");

        gpii.tests.verifyIndicator(realTimeScale.visualizer.locate("sensorValueIndicator"), "height", "230");

        realTimeScale.sensor.applier.change("sensorValue", 100);

        gpii.tests.verifyIndicator(realTimeScale.visualizer.locate("sensorValueIndicator"), "height", "460");

    });

    jqUnit.test("Test color scale", function() {
        var colorScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.colorScale, "#visualizer-colorScale", {scaleOptions: {colors: ["#FF0000","#00FF00", "#0000FF"]}});

        gpii.tests.verifyIndicator(colorScale.visualizer.locate("indicator"), "transform", "translate(40, 235)");
    });

    $(document).ready(function () {

        // var circularPercentageScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.circleRadius, "#visualizer-circularPercentageScale");
        //
        // var horizontalBarPercentageScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.horizontalBar, "#visualizer-horizontalBarPercentageScale");
        //
        // var colorScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.colorScale, "#visualizer-colorScale", {scaleOptions: {colors: ["#FF0000","#00FF00", "#0000FF"]}});
    })

}());
