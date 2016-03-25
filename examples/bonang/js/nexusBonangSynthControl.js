// TODO: Extract gpii.nexusWebSocketBoundComponent grade

(function () {
    "use strict";

    fluid.defaults("gpii.nexusBonangSynthControl", {
        gradeNames: "fluid.viewComponent",
        selectors: {
            noteInput: ".gpiic-bonang-synth-note",
            sendButton: ".gpiic-bonang-synth-send"
        },
        members: {
            websocket: null // Will be set at onCreate
        },
        invokers: {
            sendButtonHandler: {
                funcName: "gpii.nexusBonangSynthControl.sendButtonHandler",
                args: ["{that}.websocket", "{that}.dom.noteInput"]
            }
        },
        listeners: {
            "onCreate.bindNexusModel": {
                funcName: "gpii.nexusBonangSynthControl.bindNexusModel",
                args: ["{that}"]
            },
            "onCreate.registerSendButtonHandler": {
                "this": "{that}.dom.sendButton",
                method: "click",
                args: ["{that}.sendButtonHandler"]
            }
        }
    });

    gpii.nexusBonangSynthControl.bindNexusModel = function (that) {
        that.websocket = new WebSocket("ws://localhost:9081/bindModel/bonang/activeNote");
    };

    gpii.nexusBonangSynthControl.sendButtonHandler = function (websocket, noteInput) {
        var noteVal = parseInt(noteInput.val());
        websocket.send(JSON.stringify({
            path: "",
            value: noteVal
        }));
    };

}());
