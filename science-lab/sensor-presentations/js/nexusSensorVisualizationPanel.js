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

    fluid.defaults("gpii.nexusSensorVisualizer.lineChart", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.lineChart.visualizer",
                options: {
                    scaleOptions: {
                        // transform rules to apply to yScale min
                        yScaleMinTransform: {
                            "literalValue": "{sensor}.model.sensorMin"
                        },
                        // transform rules to apply to yScale max
                        yScaleMaxTransform: {
                            "literalValue": "{sensor}.model.sensorMax"
                        }
                    },
                    modelListeners: {
                        "{sensor}.model.sensorValue": {
                            func: "gpii.nexusSensorVisualizer.lineChart.accumulateSensorValues",
                            args: ["{sensorValueAccumulator}", "{visualizer}", "{change}"]
                        }
                    }
                }
            },
            sensorValueAccumulator: {
                type: "fluid.modelComponent",
                options: {
                    model: {
                        sensorValues: [],
                        maxValuesRetained: 50
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.lineChart.accumulateSensorValues = function (sensorValueAccumulator, visualizer, change) {

        var maxValuesRetained = fluid.get(sensorValueAccumulator.model, "maxValuesRetained");

        var currentSensorValues = fluid.copy(fluid.get(sensorValueAccumulator.model, "sensorValues"));
        var currentTime = new Date();

        if(currentSensorValues.length >= maxValuesRetained) {
            currentSensorValues.shift();
        }

        var sensorRecord = {
            "date": currentTime,
            "value": change.value
        };

        currentSensorValues.push(sensorRecord);

        sensorValueAccumulator.applier.change("sensorValues", currentSensorValues);

        visualizer.applier.change("dataSet", currentSensorValues);
    };

    fluid.defaults("gpii.nexusSensorVisualizer.lineChart.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "floe.chartAuthoring.lineChart.timeSeriesSingleDataSet"],
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
            }
        },
        invokers: {
            transitionChartLine: {
                funcName: "floe.chartAuthoring.lineChart.timeSeries.line.updateChartLine.defaultTransition"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.sensorPercentage", {
        gradeNames: ["fluid.modelComponent"],
        modelRelay: [{
            target: "sensorPercentage",
            singleTransform: {
                type: "gpii.sensorPlayer.transforms.minMaxScale",
                input: "{sensor}.model.sensorValue",
                inputScaleMax: "{sensor}.model.sensorMax",
                inputScaleMin: "{sensor}.model.sensorMin",
                outputScaleMax: 100,
                outputScaleMin: 0
            }
        }]
    });

    fluid.defaults("gpii.nexusSensorVisualizer.circleRadius", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.circleRadius.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.circleRadius.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusSensorVisualizer.sensorPercentage", "fluid.viewComponent"],
        selectors: {
            circle: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-circle"
        },
        modelListeners: {
            "sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization",
                args: ["{that}", "{change}"]
            }
        },
        listeners: {
            "onCreate.appendCircle": {
                "this": "{that}.container",
                method: "html",
                args: {
                expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["<h2>%description</h2> <br/> <svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-circleOutline\" cx=\"100\" cy=\"100\" r=\"100\" fill=\"red\" /><circle class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-circle\" cx=\"100\" cy=\"100\" r=\"0\" /></svg>", "{sensor}.model"]
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.circleRadius.visualizer.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("circle");
        circle.animate({"r": change.value}, 500);
    };

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar", {
        gradeNames: ["gpii.nexusSensorVisualizerBase"],
        components: {
            visualizer: {
                type: "gpii.nexusSensorVisualizer.horizontalBar.visualizer"
            }
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizer.horizontalBar.visualizer", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "gpii.nexusSensorVisualizer.sensorPercentage", "fluid.viewComponent"],
        selectors: {
            bar: ".nexus-nexusSensorVisualizationPanel-sensorDisplay-bar"
        },
        modelListeners: {
            "sensorPercentage": {
                funcName: "gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization",
                args: ["{that}", "{change}"]
            }
        },
        listeners: {
            "onCreate.appendBar": {
                "this": "{that}.container",
                method: "html",
                args: {
                expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["<h2>%description</h2> <br/> <svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><rect class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-barBackground\" width=\"200\" height=\"100\" fill=\"red\" /><rect class=\"nexus-nexusSensorVisualizationPanel-sensorDisplay-bar\" width=\"0\" height=\"100\" fill=\"blue\" /></svg>", "{sensor}.model"]
                    }
                }
            }
        }
    });

    gpii.nexusSensorVisualizer.horizontalBar.visualizer.updateVisualization = function (visualizer, change) {
        var circle = visualizer.locate("bar");
        circle.animate({"width": change.value * 2}, 500);
    };

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
        colorScaleOptions: {
            // Must be 14 colors
            // This set generated using the tool at https://gka.github.io/palettes/
            colors: ["#ff0000","#ff7100","#f49b00","#d9b100","#b3b500","#81ab00","#409200","#3a7539","#576071","#604b95","#6636a8","#6e20ab","#78079d","#800080"]
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
                funcName: "gpii.nexusSensorVisualizer.pHScale.visualizer.create",
                args: ["{that}"],
                priority: "after:createBaseSVGDrawingArea"
            }
        }
    });

    gpii.nexusSensorVisualizer.pHScale.visualizer.create = function (that) {

        var h = that.options.svgOptions.height,
            padding = 20,
            colors = that.options.colorScaleOptions.colors,
            svg = that.svg;

        var colorScaleLength = colors.length;

        that.yScale = d3.scale
               .linear()
               .domain([0,colorScaleLength])
               .range([h - padding, 0 + padding]);

    that.barHeight = (h - padding) / colorScaleLength;

    var barHeight = that.barHeight;

    for(var i=0; i< colorScaleLength; i++) {
      svg.append("rect")
         .attr({
            "x": 75,
            "y": function() {
              return that.yScale(i) - barHeight;
            },
            "width": 425,
            "height": barHeight,
            "fill": colors[i],
            "stroke": "black"
        });
    }

    for(i=0; i< colorScaleLength; i++) {
      svg.append("text")
        .text("pH Value " + i + " - " + (i+1))
        .attr({
          "text-anchor": "middle",
          "transform": "translate(75)",
          "fill": "white",
          "x": 212.5,
          "y": function() {
            return that.yScale(i) - barHeight / 2;
          },
          "font-size": 16
        })
    }

    // Draw the PH indicator

    var startingPHValue = 1;
    var pointLocation = that.yScale(startingPHValue) - 12.5;

    svg.append("polygon")
    .attr({
       "class": "phIndicator",
       "points": "0,0 0,25 25,12.5",
       "transform": "translate(45, "+ pointLocation +")",
       "fill": function() {
           var colorIdx = Math.floor(startingPHValue-1) > 0 ? Math.floor(startingPHValue-1) : 0;
           return colors[colorIdx];
       },
       "stroke": "black"
     });
    };

    gpii.nexusSensorVisualizer.pHScale.visualizer.updateVisualization = function (visualizer, change) {
        var colors = visualizer.options.colorScaleOptions.colors,
            barHeight = visualizer.barHeight;

            var padding = 20;
            var pointLocation = visualizer.yScale(change.value)  - 12.5;

            d3.select(".phIndicator")
            .transition()
            .duration(1000)
            .attr({
                "transform": "translate(45, "+ pointLocation +")",
                "fill": function() {
                    var colorIdx = Math.floor(change.value-1) > 0 ? Math.floor(change.value-1) : 0;
                    return colors[colorIdx];
                }
            });

    };

}());
