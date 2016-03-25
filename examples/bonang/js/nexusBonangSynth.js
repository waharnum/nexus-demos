(function () {
    "use strict";

    fluid.defaults("gpii.nexusBonangSynth", {
        gradeNames: "gpii.nexusWebSocketBoundComponent",
        members: {
            nexusPeerComponentPath: "bonang",
            nexusBoundModelPath: "activeNote"
        },
        model: {
            activeNote: -1
        },
        components: {
            bonang: {
                type: "fluid.trackerSynth.bonang",
                options: {
                    model: {
                        activeNote: "{gpii.nexusBonangSynth}.model.activeNote"
                    }
                }
            }
        }
    });

}());
