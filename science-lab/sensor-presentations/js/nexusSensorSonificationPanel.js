(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    // Sonification presentation panel
    fluid.defaults("gpii.nexusSensorSonificationPanel", {
        gradeNames: ["gpii.nexusSensorPresentationPanel"],
        dynamicComponents: {
            sensorPresenter: {
                type: "gpii.sensorPlayer",
                createOnEvent: "onSensorAppearance",
                options: "@expand:gpii.nexusSensorSonificationPanel.getSensorPresenterOptions({arguments}.0, {arguments}.1)"
            }
        }
    });

    // expander function; used to generate sensor sonifiers as sensors
    // are attached; dynamically configures model characteristics and
    // container for display / controls based on the sensorId
    gpii.nexusSensorSonificationPanel.getSensorPresenterOptions = function (sensorId, sensorName) {

        var sensorModelOptions = gpii.nexusSensorPresentationPanel.getSensorModelOptions(sensorId);

        var sensorContainerClass = "nexus-nexusSensorSonificationPanel-sensorDisplay-" + sensorId;

        var sensorPlayerListenerOptions = gpii.nexusSensorPresentationPanel.getSensorPresenterListenerOptions(sensorId, sensorContainerClass, sensorName);

        var sensorPlayerOptions =
        {
            events: {
                onSensorDisplayContainerAppended: null
            },
            listeners: sensorPlayerListenerOptions,
            components: {
                sensor: {
                    options: {
                        model: sensorModelOptions
                    }
                },
                sensorSonifierDisplay: {
                    type: "gpii.nexusSensorSonificationPanel.sensorSonifierDisplay",
                    container: "." + sensorContainerClass,
                    createOnEvent: "{sensorPlayer}.events.onSensorDisplayContainerAppended"
                }
            }
        };
        return sensorPlayerOptions;
    };

    fluid.defaults("gpii.nexusSensorSonificationPanel.sensorSonifierDisplay", {
        gradeNames: ["gpii.nexusSensorPresentationPanel.fadeInPresenter", "fluid.viewComponent"],
        events: {
            displayTemplateReady: null
        },
        selectors: {
            sensorNameDisplay: ".nexusc-sensorNameDisplay",
            midpointToneControl: ".nexusc-midpointToneControl",
            muteControl: ".nexusc-sensorMuteControl"
        },
        strings: {
            template: "<h2 class=\"nexusc-sensorNameDisplay\"></h2><form class=\"nexus-sensorSonifierControls\"><span class=\"nexus-sensorSonifierControls-checkboxContainer\"><label>Play Midpoint<input class=\"nexusc-midpointToneControl\" type=\"checkbox\"/><i></i></label></span><br/><span class=\"nexus-sensorSonifierControls-checkboxContainer\"><label>Mute Sensor<input class=\"nexusc-sensorMuteControl\" type=\"checkbox\"/><i></i></label></span> </form>"
        },
        listeners: {
            "onCreate.appendDisplayTemplate": {
                "this": "{that}.container",
                "method": "html",
                "args": "{that}.options.strings.template"
            },
            "onCreate.fireDisplayTemplateReady": {
                func: "{that}.events.displayTemplateReady.fire"
            },
            "onCreate.bindSynthControls": {
                func: "gpii.sensorPlayer.sensorDisplayDebug.bindSynthControls",
                args: ["{that}", "{sensorSonifier}"]
            }
        },
        components: {
            sensorNameDisplay: {
                createOnEvent: "{sensorSonifierDisplay}.events.displayTemplateReady",
                type: "gpii.sensorPlayer.valueDisplay",
                container: "{sensorSonifierDisplay}.dom.sensorNameDisplay",
                options: {
                    model: {
                        value: "{sensor}.model.description"
                    },
                    strings: {
                        template: "<span class=\"flc-valueDisplay-value\"></span>"
                    }
                }
            }
        }
    });

}());
