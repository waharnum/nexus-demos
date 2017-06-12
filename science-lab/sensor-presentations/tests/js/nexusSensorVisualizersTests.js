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
    })

    gpii.tests.mockSensorVisualizerFactory = function (sensorVisualizerGrade, visualizerContainer) {
        return sensorVisualizerGrade({
            gradeNames: ["gpii.tests.testVisualizerBase"],
            components: {
                visualizer: {
                    container: visualizerContainer
                }
            }
        })
    };

    $(document).ready(function () {

        var realTimeScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.realTimeScale, "#visualizer-realTimeScale");

        var circularPercentageScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.circleRadius, "#visualizer-circularPercentageScale")

        var horizontalBarPercentageScale = gpii.tests.mockSensorVisualizerFactory(gpii.nexusSensorVisualizer.horizontalBar, "#visualizer-horizontalBarPercentageScale");

    })

}());
