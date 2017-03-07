(function () {
    "use strict";

    fluid.defaults("fluid.trackerSynth", {
        gradeNames: "fluid.viewComponent",

        components: {
            region: {
                type: "fluid.trackerSynth.trackingRegion",
                container: "{that}.container"
            },

            // TODO: @simonbates, you'll need to swap this component
            // out for a new one that listens for Nexus changes and converts
            // from your camera coordinate system to model.position.x/y float values
            // in the range from 0.0 to 1.0 (zero representing left and top, respectively).
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
            },

            bonang: {
                type: "fluid.trackerSynth.bonang",
                options: {
                    numNotes: "{zoneController}.dom.zones.length",
                    model: {
                        activeNote: "{zoneController}.model.activeZoneIdx"
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.trackerSynth.trackingRegion", {
        gradeNames: "fluid.viewComponent",

        model: {
            height: {
                expander: {
                    "this": "{that}.container",
                    method: "height"
                }
            },

            width: {
                expander: {
                    "this": "{that}.container",
                    method: "width"
                }
            }
        }
    });
}());
