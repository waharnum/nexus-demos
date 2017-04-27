(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    var d3 = fluid.registerNamespace("d3");

    // A specifically formatted heat scale,
    fluid.defaults("gpii.nexusSensorVisualizer.temperature", {
        gradeNames: ["gpii.nexusSensorVisualizer.colorScale"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.temperature.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.temperature.visualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.colorScale.visualizer"],
        model: {
            svgTitle: "An animated heat scale.",
            svgDescription: "An animated heat scale."
        },
        scaleOptions: {
            min: 10,
            max: 40,
            gradientMarkup: {
                temperatureGradient: "<linearGradient id=\"TemperatureGradient\" x1=\"0\" x2=\"0\" y1=\"0\" y2=\"1\"> <stop offset=\"20%\" stop-color=\"red\"/> <stop offset=\"40%\" stop-color=\"white\" stop-opacity=\"0\"/> <stop offset=\"80%\" stop-color=\"blue\"/> </linearGradient>"
            },
            colors:
            ["url(#TemperatureGradient)"],
            textOptions: {
                // Creates labels for each point of the scale
                labels: {
                    template: ""
                }
            }
        },
        invokers: {
            getIndicatorColor: {
                funcName: "gpii.nexusSensorVisualizer.temperature.visualizer.getIndicatorColor",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    gpii.nexusSensorVisualizer.temperature.visualizer.getIndicatorColor = function(that, indicatorValue) {
        var thresholdScale = d3.scale.linear().domain([10,25,40]).range(["blue", "white", "red"]);
        return thresholdScale(indicatorValue);
    };

}());
