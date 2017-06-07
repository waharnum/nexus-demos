(function () {
    "use strict";

    // A mock nexus web socket bound component that doesn't
    // actually connect to the Nexus, but has the same
    // behaviours from the PoV of a grade using it
    //
    // Having the Nexus "send" is a matter of updating the
    // appropriate model path intended to be attached via the
    // nexusBoundModelPath member

    fluid.defaults("gpii.nexusWebSocketBoundComponentMock", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent"],
        listeners: {
            "onCreate.constructPeer": {
                funcName: "{that}.events.onPeerConstructed.fire"
            },
            "onPeerConstructed.bindNexusModel": {
                funcName: "gpii.nexusWebSocketBoundComponentMock.bindModel",
                args: [
                    "{that}",
                    "{that}.receivesChangesFromNexus",
                    "{that}.nexusMessageListener",
                    "{that}.events.onWebsocketConnected"
                ]
            },
            "onWebsocketConnected.registerModelListenerForNexus": {
                funcName: "gpii.nexusWebSocketBoundComponentMock.registerModelListener",
                args: [
                    "{that}.sendsChangesToNexus",
                    "{that}.applier",
                    "{that}.nexusBoundModelPath",
                    "{that}.sendModelChangeToNexus"
                ]
            }
        }
    }
);

gpii.nexusWebSocketBoundComponentMock.bindModel = function (that, shouldRegisterMessageListener, messageListener, onWebsocketConnectedEvent) {
    return;
};

gpii.nexusWebSocketBoundComponentMock.registerModelListener = function (shouldRegisterModelChangeListener, applier, modelPath, modelChangeListener) {
    return;
};

    fluid.defaults("gpii.nexusSensorPresentationPanelMock", {
        gradeNames: ["gpii.nexusSensorPresentationPanel", "gpii.nexusWebSocketBoundComponentMock", "fluid.viewComponent"],
        // Eases testing, since we don't have to pause to wait for
        // the fade-out animation before testing that the container
        // is removed
        dynamicComponentContainerOptions: {
            fadeOut: false
        }
    });

    fluid.defaults("gpii.nexusSensorVisualizationPanelMock", {
        gradeNames: ["gpii.nexusSensorVisualizationPanel", "gpii.nexusSensorPresentationPanelMock"]
    });

    fluid.defaults("gpii.nexusSensorSonificationPanelMock", {
        gradeNames: ["gpii.nexusSensorSonificationPanel", "gpii.nexusSensorPresentationPanelMock"]
    });

}());
