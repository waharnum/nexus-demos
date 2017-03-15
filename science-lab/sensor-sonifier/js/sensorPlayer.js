(function ($, fluid) {

    "use strict";

    var environment = flock.init();
    environment.start();

    fluid.defaults("fluid.sensorPlayer.sensor", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            sensorValue: 50,
            simulateChanges: false,
            simulateChangesInterval: 2000,
            sensorMax: 100,
            sensorMin: 0,
            description: "A sensor"
        },
        members: {
            simulateChangesIntervalId: null
        },
        modelListeners: {
            sensorValue: {
                "this": "console",
                "method": "log",
                "args": "{that}.model.sensorValue"
            },
            simulateChanges: {
                "funcName": "fluid.sensorPlayer.sensor.simulateChanges",
                "args": ["{that}", "{that}.model.simulateChanges"]
            }
        }
    });

    fluid.sensorPlayer.sensor.randomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    fluid.defaults("fluid.sensorPlayer.sensor.pHSensor", {
        gradeNames: ["fluid.sensorPlayer.sensor"],
        model: {
            sensorValue: 7,
            sensorMax: 14,
            sensorMin: 1,
            description: "A simulated pH sensor."
        }
    });

    fluid.defaults("fluid.sensorPlayer.sensor.temperatureSensor", {
        gradeNames: ["fluid.sensorPlayer.sensor"],
        model: {
            sensorValue: 18,
            sensorMax: 26,
            sensorMin: 18,
            description: "A simulated temperature sensor (in celcius); constrained from 18 to 26."
        }
    });

    fluid.sensorPlayer.sensor.simulateChanges = function(that, simulateChanges) {
        if(simulateChanges) {
            // Turn on the interval changes to the sensorValue
            that.simulateChangesIntervalId = setInterval(function() {
                that.applier.change("sensorValue", fluid.sensorPlayer.sensor.randomInt(that.model.sensorMax, that.model.sensorMin));
            }, that.model.simulateChangesInterval);
        } else {
            // Turn off the interval changes to the sensorValue
            clearInterval(that.simulateChangesIntervalId);
        }
    };

    // A sensor synthesizer that translates a lower and upper bounded
    // sensor into lower or higher frequencies
    // Also plays a continuous "midpoint" tone
    fluid.defaults("fluid.sensorPlayer.sensorScalingSynthesizer", {
        gradeNames: ["flock.modelSynth"],
        model: {
            inputs: {
                carrier: {
                    freq: 440
                }
            },
            freqMax: 680,
            freqMin: 200,
            sensorMax: 100,
            sensorMin: 0,
            sensorValue: 50,
            gradualToneChange: false,
            gradualToneChangeDuration: 500,
            graduateToneChangeTickDuration: 100
        },
        synthDef: [
            {
            id: "carrier",
            ugen: "flock.ugen.sin",
            inputs: {
                freq: 440,
                mul: {
                    id: "mod",
                    ugen: "flock.ugen.sinOsc",
                    freq: 0.1,
                    mul: 0.5
                }
                }
            },
            {
            id: "midpoint",
            ugen: "flock.ugen.sin",
            inputs: {
                freq: 440,
                mul: 0
                }
            }
        ],
        addToEnvironment: true,
        modelListeners: {
            sensorValue: {
                funcName: "fluid.sensorPlayer.sensorScalingSynthesizer.relaySensorValue",
                args: ["{that}", "{that}.model.sensorValue"]
            }
        }
    });

    fluid.sensorPlayer.sensorScalingSynthesizer.relaySensorValue = function(that, newSensorValue) {
        var freqMax = that.model.freqMax,
            freqMin = that.model.freqMin,
            currentSynthFreq = that.model.inputs.carrier.freq,
            sensorMax = that.model.sensorMax,
            sensorMin = that.model.sensorMin,
            gradualToneChange = that.model.gradualToneChange,
            gradualToneChangeDuration = that.model.gradualToneChangeDuration,
            graduateToneChangeTickDuration = that.model.graduateToneChangeTickDuration;

        var targetFreq = fluid.sensorPlayer.sensorScalingSynthesizer.scaleValue(newSensorValue, sensorMin, sensorMax, freqMin, freqMax);
        var midpointFreq = fluid.sensorPlayer.sensorScalingSynthesizer.getMidpointValue(freqMax, freqMin);

        that.applier.change("inputs.midpoint.freq", midpointFreq);

        if(gradualToneChange) {
            fluid.sensorPlayer.sensorScalingSynthesizer.adjustFrequencyGradually(that, currentSynthFreq, targetFreq, gradualToneChangeDuration, graduateToneChangeTickDuration);
        } else {
            that.applier.change("inputs.carrier.freq", targetFreq);
        }
    };

    // Adjust a frequency up or down evenly over "duration"
    fluid.sensorPlayer.sensorScalingSynthesizer.adjustFrequencyGradually = function (that, currentFreq, targetFreq, duration, tick) {
        var totalMovement = targetFreq - currentFreq;
        var intervals = duration / tick;
        var tickMovement = totalMovement / intervals;

        var currentTickTime = tick;
        for(var i = 1; i < intervals; i++ ) {
            setTimeout(function() {
                var existingFreq = fluid.get(that.model, "inputs.carrier.freq");
                var freqToMoveTo = existingFreq + tickMovement;
                that.applier.change("inputs.carrier.freq", freqToMoveTo);
            }, currentTickTime);
            currentTickTime = currentTickTime + tick;
        }


    };

    fluid.sensorPlayer.sensorScalingSynthesizer.getMidpointValue = function(upper, lower) {
        return (upper + lower) / 2;
    };

    fluid.sensorPlayer.sensorScalingSynthesizer.scaleValue = function (value, inputLower, inputUpper, outputLower, outputUpper) {
        var scaledValue = ((outputUpper - outputLower) * (value - inputLower) / (inputUpper - inputLower)) + outputLower;
        return scaledValue;
    };

    fluid.defaults("fluid.sensorPlayer.valueDisplay", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            value: "Hello, World!"
        },
        members: {
            template: "<p class=\"flc-valueDisplay-value\"></p>"
        },
        selectors: {
            value: ".flc-valueDisplay-value"
        },
        listeners: {
            "onCreate.appendTemplate": {
                "this": "{that}.container",
                "method": "html",
                "args": "{that}.template"
            },
            "onCreate.setInitialValue": {
                "this": "{that}.dom.value",
                "method": "html",
                "args": ["{that}.model.value"]
            }
        },
        modelListeners: {
            value: {
                "this": "{that}.dom.value",
                "method": "html",
                "args": ["{that}.model.value"]
            }
        }
    });

    fluid.defaults("fluid.sensorPlayer", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            displayTemplateReady: null
        },
        selectors: {
            sensorMaxDisplay: ".flc-sensorMaxValue",
            sensorMinDisplay: ".flc-sensorMinValue",
            sensorValueDisplay: ".flc-sensorValue",
            synthFreqDisplay: ".flc-freqValue",
            descriptionDisplay: ".flc-descriptionDisplay",
            gradualToneControl: ".flc-gradualToneControl",
            midpointToneControl: ".flc-midpointToneControl",
            muteControl: ".flc-muteControl"
        },
        members: {
            template: "<div class=\"flc-descriptionDisplay\"></div><div class=\"flc-sensorMaxValue\"></div><div class=\"flc-sensorMinValue\"></div><div class=\"flc-sensorValue\"></div><div class=\"flc-freqValue\"></div><form> <label>Gradual Tone Change<input class=\"flc-gradualToneControl\" type=\"checkbox\"/></label> <label>Play Sensor Midpoint Tone<input class=\"flc-midpointToneControl\" type=\"checkbox\"/></label><br/> <label><strong>Mute Main Synthesizer</strong><input class=\"flc-muteControl\" type=\"checkbox\"/></label> </form>"
        },
        listeners: {
            "onCreate.appendDisplayTemplate": {
                "this": "{that}.container",
                "method": "html",
                "args": "{that}.template"
            },
            "onCreate.fireDisplayTemplateReady": {
                func: "{that}.events.displayTemplateReady.fire"
            },
            "onCreate.bindSynthControls": {
                func: "fluid.sensorPlayer.bindSynthControls",
                args: ["{that}"]
            }
        },
        components: {
            sensor: {
                type: "fluid.sensorPlayer.sensor",
                options: {
                    model: {
                        simulateChanges: true
                    }
                }
            },
            sensorSynthesizer: {
                type: "fluid.sensorPlayer.sensorScalingSynthesizer",
                options: {
                    model: {
                        sensorValue: "{sensor}.model.sensorValue",
                        sensorMax: "{sensor}.model.sensorMax",
                        sensorMin: "{sensor}.model.sensorMin"
                    },
                    addToEnvironment: true
                }
            },
            descriptionDisplay: {
                createOnEvent: "{sensorPlayer}.events.displayTemplateReady",
                type: "fluid.sensorPlayer.valueDisplay",
                container: "{sensorPlayer}.dom.descriptionDisplay",
                options: {
                    model: {
                        value: "{sensor}.model.description"
                    },
                    members: {
                        template: "<strong>Sensor Description:</strong> <span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            },
            sensorMinDisplay: {
                createOnEvent: "{sensorPlayer}.events.displayTemplateReady",
                type: "fluid.sensorPlayer.valueDisplay",
                container: "{sensorPlayer}.dom.sensorMinDisplay",
                options: {
                    model: {
                        value: "{sensor}.model.sensorMin"
                    },
                    members: {
                        template: "<strong>Sensor Min Value:</strong> <span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            },
            sensorMaxDisplay: {
                createOnEvent: "{sensorPlayer}.events.displayTemplateReady",
                type: "fluid.sensorPlayer.valueDisplay",
                container: "{sensorPlayer}.dom.sensorMaxDisplay",
                options: {
                    model: {
                        value: "{sensor}.model.sensorMax"
                    },
                    members: {
                        template: "<strong>Sensor Max Value:</strong> <span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            },
            sensorDisplay: {
                createOnEvent: "{sensorPlayer}.events.displayTemplateReady",
                type: "fluid.sensorPlayer.valueDisplay",
                container: "{sensorPlayer}.dom.sensorValueDisplay",
                options: {
                    model: {
                        value: "{sensor}.model.sensorValue"
                    },
                    members: {
                        template: "<strong>Sensor Current Value:</strong> <span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            },
            synthFreqDisplay: {
                createOnEvent: "{sensorPlayer}.events.displayTemplateReady",
                type: "fluid.sensorPlayer.valueDisplay",
                container: "{sensorPlayer}.dom.synthFreqDisplay",
                options: {
                    model: {
                        value: "{sensorSynthesizer}.model.inputs.carrier.freq"
                    },
                    members: {
                        template: "<strong>Synthesizer frequency:</strong> <span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            }
        }
    });

    fluid.sensorPlayer.bindSynthControls = function (that) {
        var muteControl = that.locate("muteControl");
        var gradualToneControl = that.locate("gradualToneControl");
        var midpointToneControl = that.locate("midpointToneControl");

        muteControl.click(function () {
            var checked = muteControl.is(":checked");
            if(checked) {
                that.sensorSynthesizer.applier.change("inputs.carrier.mul", 0);
            }
            else {
                that.sensorSynthesizer.applier.change("inputs.carrier.mul", 1);
            }

        });

        gradualToneControl.click(function () {
            var checked = gradualToneControl.is(":checked");
            that.sensorSynthesizer.applier.change("gradualToneChange", checked);
        });

        midpointToneControl.click(function () {
            var checked = midpointToneControl.is(":checked");
            if(checked) {
                that.sensorSynthesizer.applier.change("inputs.midpoint.mul", 0.25);
            }
            else {
                that.sensorSynthesizer.applier.change("inputs.midpoint.mul", 0);
            }

        });

    };

    fluid.defaults("fluid.sensorPlayer.pHSensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.sensor.pHSensor"
            }
        }
    });

    fluid.defaults("fluid.sensorPlayer.temperatureSensorPlayer", {
        gradeNames: ["fluid.sensorPlayer"],
        components: {
            sensor: {
                type: "fluid.sensorPlayer.sensor.temperatureSensor"
            }
        }
    });

})(jQuery, fluid);
