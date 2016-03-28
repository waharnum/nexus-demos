(function () {
    "use strict";

    fluid.defaults("gpii.nexusBonangSynthControl", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        selectors: {
            noteInput: ".gpiic-bonang-synth-note",
            sendButton: ".gpiic-bonang-synth-send"
        },
        members: {
            nexusPeerComponentPath: "bonang",
            nexusBoundModelPath: "activeNote"
        },
        model: {
            activeNote: -1
        },
        invokers: {
            sendButtonHandler: {
                funcName: "gpii.nexusBonangSynthControl.sendButtonHandler",
                args: [
                    "{that}.applier",
                    "{that}.nexusBoundModelPath",
                    "{that}.dom.noteInput"
                ]
            }
        },
        listeners: {
            "onCreate.registerSendButtonHandler": {
                "this": "{that}.dom.sendButton",
                method: "click",
                args: ["{that}.sendButtonHandler"]
            }
        }
    });

    gpii.nexusBonangSynthControl.sendButtonHandler = function (applier, modelPath, noteInput) {
        var noteVal = fluid.parseInteger(noteInput.val());
        applier.change(modelPath, noteVal);
    };

}());
