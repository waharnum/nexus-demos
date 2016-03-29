(function () {
    "use strict";

    fluid.defaults("gpii.nexusWebSocketBoundComponent", {
        gradeNames: "fluid.modelComponent",
        members: {
            nexusHost: "localhost",
            nexusPort: 9081,
            nexusPeerComponentPath: "", // To be supplied by users of the grade
            nexusBoundModelPath: "",
            sendsChangesToNexus: false,
            receivesChangesFromNexus: false,
            websocket: null // Will be set at onCreate
        },
        invokers: {
            nexusMessageListener: {
                funcName: "gpii.nexusWebSocketBoundComponent.messageListener",
                args: [
                    "{arguments}.0",
                    "{that}.nexusBoundModelPath",
                    "{that}.applier"
                ]
            },
            sendModelChangeToNexus: {
                funcName: "gpii.nexusWebSocketBoundComponent.sendModelChangeToNexus",
                args: [
                    "{that}.websocket",
                    "{arguments}.0" // value
                ]
            }
        },
        listeners: {
            "onCreate.bindNexusModel": {
                funcName: "gpii.nexusWebSocketBoundComponent.bindModel",
                args: [
                    "{that}",
                    "{that}.receivesChangesFromNexus",
                    "{that}.nexusMessageListener"
                ]
            },
            "onCreate.registerModelListenerForNexus": {
                funcName: "gpii.nexusWebSocketBoundComponent.registerModelListener",
                args: [
                    "{that}.sendsChangesToNexus",
                    "{that}.applier",
                    "{that}.nexusBoundModelPath",
                    "{that}.sendModelChangeToNexus"
                ]
            }
        }
    });

    gpii.nexusWebSocketBoundComponent.bindModel = function (that, shouldRegisterMessageListener, messageListener) {
        var bindModelUrl = fluid.stringTemplate("ws://%host:%port/bindModel/%componentPath/%modelPath", {
            host: that.nexusHost,
            port: that.nexusPort,
            componentPath: that.nexusPeerComponentPath,
            modelPath: that.nexusBoundModelPath
        });
        that.websocket = new WebSocket(bindModelUrl);
        if (shouldRegisterMessageListener) {
            that.websocket.onmessage = messageListener;
        }
    };

    gpii.nexusWebSocketBoundComponent.registerModelListener = function (shouldRegisterModelChangeListener, applier, modelPath, modelChangeListener) {
        if (shouldRegisterModelChangeListener) {
            // TODO segs here?
            applier.modelChanged.addListener(modelPath, modelChangeListener);
        }
    };

    gpii.nexusWebSocketBoundComponent.messageListener = function (evt, modelPath, applier) {
        var value = JSON.parse(evt.data);
        applier.change(modelPath, value);
    };

    gpii.nexusWebSocketBoundComponent.sendModelChangeToNexus =  function (websocket, value) {
        websocket.send(JSON.stringify({
            path: "",
            value: value
        }));
    };

}());
