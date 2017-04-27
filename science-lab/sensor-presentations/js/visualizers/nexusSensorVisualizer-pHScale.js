(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    // A specifically formatted pH color scale, based on universal
    // indicator colors, and with some positioned example text
    fluid.defaults("gpii.nexusSensorVisualizer.pHScale", {
        gradeNames: ["gpii.nexusSensorVisualizer.colorScale"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.pHScale.visualizer",
                options: {
                    selectors: {
                        "displayExamplesCheckbox": ".gpiic-visualizer-displayExamples",
                        "pHScaleExamples": ".positionedText"
                    },
                    listeners: {
                        "onCreate.appendControls": {
                            "this": "{that}.container",
                            method: "append",
                            args: "<form class='gpiic-visualizer-controls'><label>Show Examples <input class='gpiic-visualizer-displayExamples' type='checkbox' checked /></label></form>"
                        },
                        "onCreate.bindControls": {
                            "this": "{that}.dom.displayExamplesCheckbox",
                            method: "click",
                            args: "{that}.toggleExamples"
                        }
                    },
                    invokers: {
                        toggleExamples: {
                            funcName: "gpii.nexusSensorVisualizer.pHScale.toggleExamples",
                            args: ["{that}"]
                        }
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.pHScale.toggleExamples = function (that) {
        var checked = that.locate("displayExamplesCheckbox").prop("checked");
        if(checked) {
            that.locate("pHScaleExamples").fadeIn();
        } else {
            that.locate("pHScaleExamples").fadeOut();
        }
    };

    fluid.defaults("gpii.nexusSensorVisualizer.pHScale.visualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.colorScale.visualizer"],
        model: {
            svgTitle: "An animated pH scale.",
            svgDescription: "An animated ph scale."
        },
        scaleOptions: {
            min: 0,
            max: 14,
            gradientMarkup: null,
            colors:
            ["#fe0002", "#ff6600", "#f8c50a", "#ffff01", "#b2fb0c", "#60fe2f", "#02de00", "#35a43b", "#00b46b", "#00b9b4", "#0099ff", "#0000fe", "#5d05fa", "#6600cd"],
            // This set generated using the tool at https://gka.github.io/palettes/
            //  ["#ff0000","#ff7100","#f49b00","#d9b100","#b3b500","#81ab00","#409200","#3a7539","#576071","#604b95","#6636a8","#6e20ab","#78079d","#800080"],
            textOptions: {
                // Creates labels for each point of the scale
                labels: {
                    template: ""
                },
                // Creates precisely positioned text relative to the scale
                positionedText: {
                    0: "Battery Acid",
                    2.4: "White Vinegar",
                    3.4: "Orange Juice",
                    6.5: "Milk",
                    7: "Pure Water",
                    8.1: "Sea Water",
                    9: "Baking Soda",
                    12: "Soapy Water",
                    14: "Drain Cleaner"
                }
            }
        },
        indicatorOptions: {
            startingValue: 7
        }
    });
}());
