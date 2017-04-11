(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    var d3 = fluid.registerNamespace("d3");

    fluid.defaults("gpii.nexusSensorVisualizer.colorScale", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.colorScale.visualizer",
                options: {
                    scaleOptions: {
                        min: "{colorScale}.sensor.model.sensorMin",
                        max: "{colorScale}.sensor.model.sensorMax"
                    },
                    indicatorOptions: {
                        startingValue: "{colorScale}.sensor.model.sensorValue"
                    },
                    modelListeners: {
                        "{colorScale}.sensor.model.sensorValue": {
                            funcName: "gpii.nexusSensorVisualizer.pHScale.visualizer.updateVisualization",
                            args: ["{that}", "{change}"]
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.pHScale", {
        gradeNames: ["gpii.nexusSensorVisualizer.colorScale"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.pHScale.visualizer"
            }
        }
    });

    // A generic color scale with an indicator
    fluid.defaults("gpii.nexusSensorVisualizer.colorScale.visualizer", {
        gradeNames: ["floe.svgDrawingArea"],
        model: {
            svgTitle: "An animated scale.",
            svgDescription: "An animated scale."
        },
        selectors: {
            indicator: ".nexusc-indicator"
        },
        scaleOptions: {
            min: 0,
            max: 100,
            colors: ["#FF0000", "#00FF00", "#0000FF"],
            textOptions: {
                // Creates labels for each point of the scale
                labels: {
                    template: "Value %bandStart - %bandEnd",
                    // Scales the font size relative to the
                    // bar height - this may need tweaking
                    // dependent on the number of bars and
                    // the length of the template
                    labelTextScalingToBarHeight: 0.25,
                    valueDecimalPlaces: 2
                }
                // Creates precisely positioned text relative to the scale
                // positionedText: {
                //     0: "0",
                //     50: "50",
                //     100: "100"
                // }
            },
            // All-around padding when creating the scale
            padding: 20,
            leftPadding: 75
        },
        indicatorOptions: {
            startingValue: 50
        },
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
            },
            "onCreate.createBaseSVGDrawingArea": {
                func: "{that}.createBaseSVGDrawingArea"
            },
            "onCreate.createVisualizer": {
                funcName: "gpii.nexusSensorVisualizer.pHScale.visualizer.createVisualizer",
                args: ["{that}"],
                priority: "after:createBaseSVGDrawingArea"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.pHScale.visualizer", {
        gradeNames: ["gpii.nexusSensorVisualizer.colorScale.visualizer"],
        model: {
            svgTitle: "An animated pH scale.",
            svgDescription: "An animated ph scale."
        },
        scaleOptions: {
            min: 0,
            max: 14,
            // This set generated using the tool at https://gka.github.io/palettes/
            colors: ["#ff0000","#ff7100","#f49b00","#d9b100","#b3b500","#81ab00","#409200","#3a7539","#576071","#604b95","#6636a8","#6e20ab","#78079d","#800080"],
            textOptions: {
                // Creates labels for each point of the scale
                labels: {
                    template: "pH Value %bandStart - %bandEnd",
                    labelTextScalingToBarHeight: 0.5,
                    valueDecimalPlaces: 0
                },
                // Creates precisely positioned text relative to the scale
                positionedText: {
                    0: "Battery Acid",
                    3: "Orange Juice",
                    6.5: "Milk",
                    7: "Pure Water",
                    8.1: "Sea Water",
                    12: "Soapy Water",
                    14: "Drain Cleaner"
                }
            }
        },
        indicatorOptions: {
            startingValue: 7
        }
    });

    gpii.nexusSensorVisualizer.pHScale.visualizer.createYScale = function (that) {

        var h = that.options.svgOptions.height,
            padding = that.options.scaleOptions.padding,
            scaleMin = that.options.scaleOptions.min,
            scaleMax = that.options.scaleOptions.max;

        that.yScale = d3.scale
               .linear()
               .domain([scaleMin,scaleMax])
               .range([h - padding, 0 + padding]);
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScale = function (that) {
        var h = that.options.svgOptions.height,
            w = that.options.svgOptions.width,
            padding = that.options.scaleOptions.padding,
            leftPadding = that.options.scaleOptions.leftPadding,
            colors = that.options.scaleOptions.colors,
            scaleMin = that.options.scaleOptions.min,
            scaleMax = that.options.scaleOptions.max,
            svg = that.svg;

        var colorScaleLength = colors.length;

        // Ordinal scale used for positioning color bands
        that.colorToPositionScale = d3.scale.ordinal()
        .domain(colors)
        .rangeBands([h - padding, 0 + padding]);

        // Quantize scale used for converting a scaled
        // value into a color
        that.valueToColorScale = d3.scale.quantize()
        .domain([scaleMin, scaleMax])
        .range(colors);

        var colorToPositionScale = that.colorToPositionScale;

        that.barNumberToScaleRatio = scaleMax / colorScaleLength;

        that.barHeight = ((h - padding) / (colorScaleLength));

        var barHeight = that.barHeight;

        fluid.each(colors, function(color) {
            svg.append("rect")
               .attr({
                  "x": leftPadding,
                  "y": function() {
                    return colorToPositionScale(color);
                  },
                  "width": w - leftPadding,
                  "height": barHeight,
                  "fill": color,
                  "stroke": "#FCC"
              });
        });

    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScaleLabels = function (that) {

        var colors = that.options.scaleOptions.colors,
            textOptions = that.options.scaleOptions.textOptions,
            leftPadding = that.options.scaleOptions.leftPadding,
            scaleMin = that.options.scaleOptions.min,
            scaleMax = that.options.scaleOptions.max,
            w = that.options.svgOptions.width,
            svg = that.svg,
            barHeight = that.barHeight,
            labelTextScalingToBarHeight =  that.options.scaleOptions.textOptions.labels.labelTextScalingToBarHeight;

        var colorToPositionScale = that.colorToPositionScale;

        // Helps figure out which label should go with which color
        var colorLabelScale = d3.scale.ordinal()
        .domain(colors)
        .rangeBands([scaleMin, scaleMax]);

        // Get an array with the range values, plus the max, for use in labeling
        var colorLabelScaleRange = colorLabelScale.range();
        colorLabelScaleRange.push(scaleMax);

        fluid.each(colors, function(color, index) {
            svg.append("text")
              .text(gpii.nexusSensorVisualizer.pHScale.visualizer.getColorScaleLabelText(index, textOptions, colorLabelScaleRange))
              .attr({
                "text-anchor": "middle",
                "transform": "translate(" + leftPadding + ")",
                "fill": "white",
                "x": (w - leftPadding) / 2,
                "y": function() {
                  return colorToPositionScale(color) + barHeight / 2;
                },
                "font-size": barHeight * labelTextScalingToBarHeight
            });
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.getColorScaleLabelText = function (index, textOptions, colorLabelScaleRange) {

        var template = textOptions.labels.template,
            valueDecimalPlaces = textOptions.labels.valueDecimalPlaces;

        // What is the starting value of this color band to the scale
        var bandStart = colorLabelScaleRange[index].toFixed(valueDecimalPlaces);

        // What is the ending value of this color band to the scale
        var bandEnd = colorLabelScaleRange[index+1].toFixed(valueDecimalPlaces);

        var templateValues = {
            bandStart: bandStart,
            bandEnd: bandEnd
        };

        return fluid.stringTemplate(template, templateValues);
    };


    gpii.nexusSensorVisualizer.pHScale.visualizer.createPositionedText = function (that) {
        var positionedTextValues = that.options.scaleOptions.textOptions.positionedText,
            leftPadding = that.options.scaleOptions.leftPadding,
            w = that.options.svgOptions.width,
            svg = that.svg;

            // Background filter for text
            var filter =
            svg.append("defs")
            .append("filter")
            .attr({
                "x": 0,
                "y": 0,
                "width": 1,
                "height": 1,
                "id": "solid"
            });

            filter.append("feFlood")
            .attr({
                "flood-color": "black"
            });

            filter.append("feComposite")
            .attr("in", "SourceGraphic");


        fluid.each(positionedTextValues, function (text, key) {
            svg.append("text")
            .text(text)
            .attr({
                "text-anchor": "end",
                "transform": "translate(" + leftPadding + ")",
                "fill": "white",
                "filter": "url(#solid)",
                "x": w - (leftPadding+5),
                "y": function() {
                  return that.yScale(key);
                },
                // Keeps these at an even size
                "font-size": that.barHeight / 3,
                "dominant-baseline": "central"
            });
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createIndicator = function (that) {
        // Draw the PH indicator

        var svg = that.svg,
            valueToColorScale = that.valueToColorScale;

        var startingValue = that.options.indicatorOptions.startingValue;

        // Where the point of the arrow should be aligned
        var pointLocation = that.yScale(startingValue) - 15;

        that.indicator =
        svg.append("path")
        .attr({
            "class" : "nexusc-indicator",
            "transform": "translate(40, "+ pointLocation +")",
            "fill": function() {
                return valueToColorScale(startingValue);
            },
            "d": "M20 20 h-40 v-10 h40 v-10 l15 15 l-15 15 v-10",
            "stroke": "black"
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createVisualizer = function (that) {

        var h = that.options.svgOptions.height,
            padding = that.options.scaleOptions.padding,
            colors = that.options.scaleOptions.colors;

        var colorScaleLength = colors.length;

    that.barHeight = (h - padding) / colorScaleLength;

    gpii.nexusSensorVisualizer.pHScale.visualizer.createYScale(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScale(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScaleLabels(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPositionedText(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createIndicator(that);
 };

    gpii.nexusSensorVisualizer.pHScale.visualizer.getIndicatorColor = function (value, colors, colorToScaleRatio) {
        var scaledValue = value / colorToScaleRatio;
        var colorIdx = Math.ceil(scaledValue-1) > 0 ? Math.ceil(scaledValue-1) : 0;
        return colors[colorIdx];
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.updateVisualization = function (visualizer, change) {
        var valueToColorScale = visualizer.valueToColorScale;

            var newIndicatorLocation = visualizer.yScale(change.value) - 15;
            var newIndicatorColor = valueToColorScale(change.value);

            visualizer.indicator
            .transition()
            .duration(1000)
            .attr({
                "transform": "translate(40, "+ newIndicatorLocation +")",
                "fill": newIndicatorColor
            });

    };

}());
