(function () {
    "use strict";

    // A mock nexus web socket bound component that doesn't
    // actually connect to the Nexus, but has the same
    // behaviours

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
        gradeNames: ["gpii.nexusSensorPresentationPanel", "gpii.nexusWebSocketBoundComponentMock"]
    });

    fluid.defaults("gpii.nexusSensorPresentationPanelMock", {
        gradeNames: ["gpii.nexusSensorPresentationPanel", "gpii.nexusWebSocketBoundComponentMock", "fluid.viewComponent"]
    });

    fluid.defaults("gpii.nexusSensorVisualizationPanelMock", {
        gradeNames: ["gpii.nexusSensorVisualizationPanel", "gpii.nexusSensorPresentationPanelMock"]
    });

}());