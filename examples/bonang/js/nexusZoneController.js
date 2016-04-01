(function () {
    "use strict";

    fluid.defaults("gpii.nexusZoneController", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        members: {
            nexusPeerComponentPath: "nexus.bonang.zoneController",
            nexusBoundModelPath: "activeZoneIdx",
            sendsChangesToNexus: true,
            receivesChangesFromNexus: false
        },
        model: {
            activeZoneIdx: "{zoneController}.model.activeZoneIdx"
        },
        components: {
            region: {
                type: "fluid.trackerSynth.trackingRegion",
                container: "{that}.container"
            },
            tracker: {
                type: "fluid.mouseTracker",
                container: "{that}.container",
                options: {
                    model: {
                        bounds: "{region}.model"
                    }
                }
            },
            pointer: {
                type: "fluid.trackerSynth.pointer",
                container: "#pointer",
                options: {
                    model: {
                        position: {
                            relative: "{tracker}.model.position"
                        },
                        bounds: "{region}.model"
                    }
                }
            },
            zoneController: {
                type: "fluid.trackerSynth.zoneController",
                container: ".controller",
                options: {
                    model: {
                        pointerPosition: "{pointer}.model.position.absolute"
                    }
                }
            }
        }
    });

}());
