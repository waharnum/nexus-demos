(function ($, fluid) {

    "use strict";

    var environment = flock.init();
    environment.start();

    fluid.defaults("gpii.sensorPlayer.sensor", {
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
                "funcName": "gpii.sensorPlayer.sensor.simulateChanges",
                "args": ["{that}", "{that}.model.simulateChanges"]
            }
        }
    });

    gpii.sensorPlayer.sensor.randomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    fluid.defaults("gpii.sensorPlayer.sensor.pHSensor", {
        gradeNames: ["gpii.sensorPlayer.sensor"],
        model: {
            sensorValue: 7,
            sensorMax: 14,
            sensorMin: 1,
            description: "A simulated pH sensor."
        }
    });

    fluid.defaults("gpii.sensorPlayer.sensor.temperatureSensor", {
        gradeNames: ["gpii.sensorPlayer.sensor"],
        model: {
            sensorValue: 18,
            sensorMax: 26,
            sensorMin: 18,
            description: "A simulated temperature sensor (in celcius); constrained from 18 to 26."
        }
    });

    gpii.sensorPlayer.sensor.simulateChanges = function(that, simulateChanges) {
        if(simulateChanges) {
            // Turn on the interval changes to the sensorValue
            that.simulateChangesIntervalId = setInterval(function() {
                that.applier.change("sensorValue", gpii.sensorPlayer.sensor.randomInt(that.model.sensorMax, that.model.sensorMin));
            }, that.model.simulateChangesInterval);
        } else {
            // Turn off the interval changes to the sensorValue
            clearInterval(that.simulateChangesIntervalId);
        }
    };

    // A sensor synthesizer that translates a lower and upper bounded
    // sensor into lower or higher frequencies
    // Also plays a continuous "midpoint" tone
    fluid.defaults("gpii.sensorPlayer.sensorSonifier", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            sensorMax: 100,
            sensorMin: 0,
            sensorValue: 50
        },
        components: {
            scalingSynth: {
                type: "gpii.sensorPlayer.scalingSynth",
                options: {
                    model: {
                        valueInformation: {
                            max: "{sensorSonifier}.model.sensorMax",
                            min: "{sensorSonifier}.model.sensorMin",
                            current: "{sensorSonifier}.model.sensorValue"
                        }
                    }
                }
            }
        }
    });

    // A model-driven synth that scales model values
    fluid.defaults("gpii.sensorPlayer.scalingSynth", {
        gradeNames: ["flock.modelSynth"],
        modelListeners: {
            valueInformation: {
                funcName: "gpii.sensorPlayer.sensorSonifier.relaySensorValue",
                args: ["{that}", "{that}.model.valueInformation"]
            }
        },
        model: {
            // In real-world usage, these will be bound
            // to models from other components
            valueInformation: {
                max: "680",
                min: "200",
                current: "440"
            },
            inputs: {
                carrier: {
                    freq: 440
                }
            },
            freqMax: 680,
            freqMin: 200
        },
        synthDef: {
            ugen: "flock.ugen.out",
            sources: [
                {
                    ugen: "flock.ugen.sum",
                    sources: [
                        {
                        id: "carrier",
                        ugen: "flock.ugen.sin",
                        inputs: {
                            freq: 440,
                            mul: {
                                id: "mod",
                                ugen: "flock.ugen.sinOsc",
                                freq: 0.1,
                                mul: 0.25
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
                    ]
                }
            ]
        },
        addToEnvironment: true
    });

    gpii.sensorPlayer.sensorSonifier.relaySensorValue = function(that, valueInformation) {
        var freqMax = that.model.freqMax,
            freqMin = that.model.freqMin,
            sensorMax = valueInformation.max,
            sensorMin = valueInformation.min;

        var targetFreq = gpii.sensorPlayer.sensorSonifier.scaleValue(valueInformation.current, sensorMin, sensorMax, freqMin, freqMax);
        var midpointFreq = gpii.sensorPlayer.sensorSonifier.getMidpointValue(freqMax, freqMin);

        that.applier.change("inputs.midpoint.freq", midpointFreq);

        that.applier.change("inputs.carrier.freq", targetFreq);
    };

    gpii.sensorPlayer.sensorSonifier.getMidpointValue = function(upper, lower) {
        return (upper + lower) / 2;
    };

    gpii.sensorPlayer.sensorSonifier.scaleValue = function (value, inputLower, inputUpper, outputLower, outputUpper) {
        var scaledValue = ((outputUpper - outputLower) * (value - inputLower) / (inputUpper - inputLower)) + outputLower;
        return scaledValue;
    };

    fluid.defaults("gpii.sensorPlayer.valueDisplay", {
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

    fluid.defaults("gpii.sensorPlayer.sensorDisplayDebug", {
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
            midpointToneControl: ".flc-midpointToneControl",
            muteControl: ".flc-muteControl"
        },
        members: {
            template: "<div class=\"flc-descriptionDisplay\"></div><div class=\"flc-sensorMaxValue\"></div><div class=\"flc-sensorMinValue\"></div><div class=\"flc-sensorValue\"></div><div class=\"flc-freqValue\"></div><form> <label>Play Sensor Midpoint Tone<input class=\"flc-midpointToneControl\" type=\"checkbox\"/></label><br/> <label><strong>Mute Synthesizer</strong><input class=\"flc-muteControl\" type=\"checkbox\"/></label> </form>"
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
                func: "gpii.sensorPlayer.sensorDisplayDebug.bindSynthControls",
                args: ["{that}", "{sensorSynthesizer}"]
            }
        },
        components: {
            descriptionDisplay: {
                createOnEvent: "{sensorDisplayDebug}.events.displayTemplateReady",
                type: "gpii.sensorPlayer.valueDisplay",
                container: "{sensorDisplayDebug}.dom.descriptionDisplay",
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
                createOnEvent: "{sensorDisplayDebug}.events.displayTemplateReady",
                type: "gpii.sensorPlayer.valueDisplay",
                container: "{sensorDisplayDebug}.dom.sensorMinDisplay",
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
                createOnEvent: "{sensorDisplayDebug}.events.displayTemplateReady",
                type: "gpii.sensorPlayer.valueDisplay",
                container: "{sensorDisplayDebug}.dom.sensorMaxDisplay",
                options: {
                    model: {
                        value: "{sensor}.model.sensorMax"
                    },
                    members: {
                        template: "<strong>Sensor Max Value:</strong> <span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            },
            sensorDisplayDebug: {
                createOnEvent: "{sensorDisplayDebug}.events.displayTemplateReady",
                type: "gpii.sensorPlayer.valueDisplay",
                container: "{sensorDisplayDebug}.dom.sensorValueDisplay",
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
                createOnEvent: "{sensorDisplayDebug}.events.displayTemplateReady",
                type: "gpii.sensorPlayer.valueDisplay",
                container: "{sensorDisplayDebug}.dom.synthFreqDisplay",
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

    gpii.sensorPlayer.sensorDisplayDebug.bindSynthControls = function (that, sensorSynthesizer) {
        var muteControl = that.locate("muteControl");
        var midpointToneControl = that.locate("midpointToneControl");

        muteControl.click(function () {
            var checked = muteControl.is(":checked");
            if(checked) {
                sensorSynthesizer.scalingSynth.set("mod.mul", {
                    id: "fader",
                   ugen: "flock.ugen.line",
                   rate: "control",
                   start: 0.25,
                   end: 0,
                   duration: 1
                });
            }
            else {
                sensorSynthesizer.scalingSynth.set("mod.mul", {
                    id: "fader",
                   ugen: "flock.ugen.line",
                   rate: "control",
                   start: 0,
                   end: 0.25,
                   duration: 1
                });

            }

        });

        midpointToneControl.click(function () {
            var checked = midpointToneControl.is(":checked");
            if(checked) {
                sensorSynthesizer.scalingSynth.applier.change("inputs.midpoint.mul", 0.12);
            }
            else {
                sensorSynthesizer.scalingSynth.applier.change("inputs.midpoint.mul", 0);
            }

        });
    };

    fluid.defaults("gpii.sensorPlayer", {
        gradeNames: ["fluid.modelComponent"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor",
                options: {
                    model: {
                        simulateChanges: true
                    }
                }
            },
            sensorSynthesizer: {
                type: "gpii.sensorPlayer.sensorSonifier",
                options: {
                    model: {
                        sensorValue: "{sensor}.model.sensorValue",
                        sensorMax: "{sensor}.model.sensorMax",
                        sensorMin: "{sensor}.model.sensorMin"
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.sensorPlayer.pHSensorPlayer", {
        gradeNames: ["gpii.sensorPlayer"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor.pHSensor"
            }
        }
    });

    fluid.defaults("gpii.sensorPlayer.temperatureSensorPlayer", {
        gradeNames: ["gpii.sensorPlayer"],
        components: {
            sensor: {
                type: "gpii.sensorPlayer.sensor.temperatureSensor"
            }
        }
    });

})(jQuery, fluid);
