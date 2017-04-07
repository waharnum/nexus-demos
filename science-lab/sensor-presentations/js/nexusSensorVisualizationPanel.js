(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    var d3 = fluid.registerNamespace("d3");

    // Sonification presentation panel
    fluid.defaults("gpii.nexusSensorVisualizationPanel", {
        gradeNames: ["gpii.nexusSensorPresentationPanel"],
        // Key-value pairs of sensorIds / sensorPresenter grades
        perSensorPresentationGrades: {
            "fakeSensor": "gpii.nexusSensorVisualizer.lineChart",
            "fakeSensorPH": "gpii.nexusSensorVisualizer.pHScale"
        },
        defaultSensorPresentationGrade: "gpii.nexusSensorVisualizer.circleRadius",
        dynamicComponents: {
            sensorPresenter: {
                type: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterType({that}, {arguments}.0)",
                createOnEvent: "onSensorAppearance",
                options: "@expand:gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions({arguments}.0)"
            }
        }
    });

    gpii.nexusSensorVisualizationPanel.getSensorPresenterType = function (that, sensorId) {
        var perSensorPresentationGrades = that.options.perSensorPresentationGrades;
        if(perSensorPresentationGrades[sensorId]) {
            return perSensorPresentationGrades[sensorId];
        } else {
            return that.options.defaultSensorPresentationGrade;
        }
    };

    gpii.nexusSensorVisualizationPanel.getSensorPresenterOptions = function (sensorId) {

        var sensorModelOptions = gpii.nexusSensorPresentationPanel.getSensorModelOptions(sensorId);

        var sensorContainerClass = "nexus-nexusSensorVisualizationPanel-sensorDisplay-" + sensorId;

        var sensorVisualizerListenerOptions = gpii.nexusSensorPresentationPanel.getSensorPresenterListenerOptions(sensorId, sensorContainerClass);

        var sensorVisualizerOptions = {
                events: {
                    onSensorDisplayContainerAppended: null
                },
                listeners: sensorVisualizerListenerOptions,
                components: {
                    sensor: {
                        options: {
                            model: sensorModelOptions
                        }
                    },
                    visualizer: {
                        container: "." + sensorContainerClass
                    }
                }
        };

        return sensorVisualizerOptions;
    };

    // Abstract grade
    fluid.defaults("gpii.nexusSensorVisualizerBase", {
        gradeNames: ["fluid.component"],
        events: {
            onSensorDisplayContainerAppended: null
        },
        components: {
            sensor: {
                type: "fluid.modelComponent"
            },
            visualizer: {
                createOnEvent: "{nexusSensorVisualizerBase}.events.onSensorDisplayContainerAppended"
                // Must be specified; handled by dynamicComponents behaviour
                // container: ""
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.pHScale.visualizer", {
        gradeNames: ["floe.svgDrawingArea"],
        model: {
            svgTitle: "An animated pH scale.",
            svgDescription: "An animated ph scale."
        },
        colorScaleOptions: {
            // This set generated using the tool at https://gka.github.io/palettes/
            colors: ["#ff0000","#ff7100","#f49b00","#d9b100","#b3b500","#81ab00","#409200","#3a7539","#576071","#604b95","#6636a8","#6e20ab","#78079d","#800080"],
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

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScale = function (that) {
        var h = that.options.svgOptions.height,
            w = that.options.svgOptions.width,
            padding = that.options.colorScaleOptions.padding,
            leftPadding = that.options.colorScaleOptions.leftPadding,
            colors = that.options.colorScaleOptions.colors,
            svg = that.svg;

        var colorScaleLength = colors.length;

        that.yScale = d3.scale
               .linear()
               .domain([0,colorScaleLength])
               .range([h - padding, 0 + padding]);

        that.barHeight = (h - padding) / colorScaleLength;

        var barHeight = that.barHeight;

        fluid.each(colors, function(color, index) {
            svg.append("rect")
               .attr({
                  "x": leftPadding,
                  "y": function() {
                    return that.yScale(index) - barHeight;
                  },
                  "width": w - leftPadding,
                  "height": barHeight,
                  "fill": color,
                  "stroke": "#FCC"
              });
        });

    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScaleText = function (that) {

        var colors = that.options.colorScaleOptions.colors,
            leftPadding = that.options.colorScaleOptions.leftPadding,
            w = that.options.svgOptions.width,
            svg = that.svg;

        fluid.each(colors, function(color, index) {
            svg.append("text")
              .text("pH Value " + index + " - " + (index+1))
              .attr({
                "text-anchor": "middle",
                "transform": "translate(" + leftPadding + ")",
                "fill": "white",
                "x": (w - leftPadding) / 2,
                "y": function() {
                  return that.yScale(index) - that.barHeight / 2;
                },
                "font-size": that.barHeight / 2
            });
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPHIndicator = function (that) {
        // Draw the PH indicator

        var colors = that.options.colorScaleOptions.colors,
            svg = that.svg;

        var startingValue = that.options.indicatorOptions.startingValue;
        // Where the point of the arrow should be aligned
        var pointLocation = that.yScale(startingValue) - 15;

        var pHIndicatorGroup = svg.append("g")
        .attr({
            "class" : "phIndicatorGroup",
            "transform": "translate(40, "+ pointLocation +")",
            "fill": function() {
                var colorIdx = Math.ceil(startingValue-1) > 0 ? Math.ceil(startingValue-1) : 0;
                return colors[colorIdx];
            }
        });

        pHIndicatorGroup
        .append("path")
        .attr({
            "d": "M20 20 h-40 v-10 h40 v-10 l15 15 l-15 15 v-10",
            "stroke": "black"
        });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPHVisualizer = function (that) {

        var h = that.options.svgOptions.height,
            padding = that.options.colorScaleOptions.padding,
            colors = that.options.colorScaleOptions.colors;

        var colorScaleLength = colors.length;

        that.yScale = d3.scale
               .linear()
               .domain([0,colorScaleLength])
               .range([h - padding, 0 + padding]);

    that.barHeight = (h - padding) / colorScaleLength;

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScale(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createColorScaleText(that);

    gpii.nexusSensorVisualizer.pHScale.visualizer.createPHIndicator(that);
 };

    gpii.nexusSensorVisualizer.pHScale.visualizer.updateVisualization = function (visualizer, change) {
        var colors = visualizer.options.colorScaleOptions.colors;

            var pointLocation = visualizer.yScale(change.value)  - 15;

            d3.select(".phIndicatorGroup")
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
