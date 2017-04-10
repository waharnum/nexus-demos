(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    var d3 = fluid.registerNamespace("d3");

    fluid.defaults("gpii.nexusSensorVisualizer.pHScale", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.pHScale.visualizer",
                options: {
                    modelListeners: {
                        "{pHScale}.sensor.model.sensorValue": {
                            funcName: "gpii.nexusSensorVisualizer.pHScale.visualizer.updateVisualization",
                            args: ["{that}", "{change}"]
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.pHScale.visualizer", {
        gradeNames: ["floe.svgDrawingArea"],
        model: {
            svgTitle: "An animated pH scale.",
            svgDescription: "An animated ph scale."
        },
        selectors: {
            pHIndicator: ".nexusc-pHIndicator"
        },
        scaleOptions: {
            min: 0,
            max: 14,
            // This set generated using the tool at https://gka.github.io/palettes/
            colors: ["#ff0000","#ff7100","#f49b00","#d9b100","#b3b500","#81ab00","#409200","#3a7539","#576071","#604b95","#6636a8","#6e20ab","#78079d","#800080"],
            textOptions: {
                // Creates labels for each point of the scale
                labels: {
                    template: "pH Value %index - %nextIndex"
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
            },
            // All-around padding when creating the scale
            padding: 20,
            leftPadding: 75
        },
        indicatorOptions: {
            startingValue: 7
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
            "onCreate.createPHVisualizer": {
                funcName: "gpii.nexusSensorVisualizer.pHScale.visualizer.createPHVisualizer",
                args: ["{that}"],
                priority: "after:createBaseSVGDrawingArea"
            }
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
            scaleMax = that.options.scaleOptions.max,
            svg = that.svg;

        var colorScaleLength = colors.length;

        that.barHeightMultiplier = scaleMax / colorScaleLength;

        var barHeightMultiplier = that.barHeightMultiplier;

        console.log(barHeightMultiplier);

        that.barHeight = ((h - padding) / colorScaleLength) * barHeightMultiplier;

        var barHeight = that.barHeight;

        fluid.each(colors, function(color, index) {
            svg.append("rect")
               .attr({
                  "x": leftPadding,
                  "y": function() {
                    return that.yScale(index * barHeightMultiplier) - barHeight;
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
            w = that.options.svgOptions.width,
            svg = that.svg,
            barHeight = that.barHeight,
            barHeightMultiplier = that.barHeightMultiplier;

        fluid.each(colors, function(color, index) {
            svg.append("text")
              .text(gpii.nexusSensorVisualizer.pHScale.visualizer.getColorScaleLabelText(index, textOptions))
              .attr({
                "text-anchor": "middle",
                "transform": "translate(" + leftPadding + ")",
                "fill": "white",
                "x": (w - leftPadding) / 2,
                "y": function() {
                  return that.yScale(index * barHeightMultiplier) - barHeight / 3;
                },
                "font-size": barHeight / 2
            });
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.getColorScaleLabelText = function (index, textOptions) {
        var template = textOptions.labels.template;
        var templateValues = {
            index: index,
            nextIndex: index+1
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
            .attr("flood-color", "black");

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
                "font-size": that.barHeight / 3,
                "dominant-baseline": "central"
            });
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPHIndicator = function (that) {
        // Draw the PH indicator

        var colors = that.options.scaleOptions.colors,
            svg = that.svg;

        var startingValue = that.options.indicatorOptions.startingValue;
        // Where the point of the arrow should be aligned
        var pointLocation = that.yScale(startingValue) - 15;

        that.pHIndicator =
        svg.append("path")
        .attr({
            "class" : "nexusc-pHIndicator",
            "transform": "translate(40, "+ pointLocation +")",
            "fill": function() {
                var colorIdx = Math.ceil(startingValue-1) > 0 ? Math.ceil(startingValue-1) : 0;
                return colors[colorIdx];
            },
            "d": "M20 20 h-40 v-10 h40 v-10 l15 15 l-15 15 v-10",
            "stroke": "black"
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPHVisualizer = function (that) {

        var h = that.options.svgOptions.height,
            padding = that.options.scaleOptions.padding,
            colors = that.options.scaleOptions.colors;

        var colorScaleLength = colors.length;

    that.barHeight = (h - padding) / colorScaleLength;

    gpii.nexusSensorVisualizer.pHScale.visualizer.createYScale(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScale(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScaleLabels(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPositionedText(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPHIndicator(that);
 };

    gpii.nexusSensorVisualizer.pHScale.visualizer.updateVisualization = function (visualizer, change) {
        var colors = visualizer.options.scaleOptions.colors;

            var pointLocation = visualizer.yScale(change.value)  - 15;

            visualizer.pHIndicator
            .transition()
            .duration(1000)
            .attr({
                "transform": "translate(40, "+ pointLocation +")",
                "fill": function() {
                    var colorIdx = Math.ceil(change.value-1) > 0 ? Math.ceil(change.value-1) : 0;
                    return colors[colorIdx];
                }
            });

    };

}());
