// TODO: Extract gpii.nexusWebSocketBoundComponent grade

(function () {
    "use strict";

    fluid.defaults("gpii.nexusBonangSynth", {
        gradeNames: "fluid.modelComponent",
        components: {
            bonang: {
                type: "fluid.trackerSynth.bonang"
            }
        },
        invokers: {
            nexusMessageListener: {
                funcName: "gpii.nexusBonangSynth.nexusMessageListener",
                args: [
                    "{arguments}.0",
                    "{that}.bonang.applier"
                ]
            }
        },
        listeners: {
            "onCreate.bindNexusModel": {
                funcName: "gpii.nexusBonangSynth.bindNexusModel",
                args: [ "{that}", "{that}.nexusMessageListener" ]
            }
        }
    });

    gpii.nexusBonangSynth.bindNexusModel = function (that, messageListener) {
        that.websocket = new WebSocket("ws://localhost:9081/bindModel/bonang/activeNote");
        that.websocket.onmessage = messageListener;
    };

    gpii.nexusBonangSynth.nexusMessageListener = function (evt, applier) {
        var activeNote = JSON.parse(evt.data);
        applier.change("activeNote", activeNote);
    };

}());
