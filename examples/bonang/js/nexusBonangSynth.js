(function () {
    "use strict";

    fluid.defaults("gpii.nexusBonangSynth", {
        gradeNames: "gpii.nexusWebSocketBoundComponent",
        members: {
            nexusPeerComponentPath: "nexus.bonang.synth",
            nexusBoundModelPath: "controls",
            sendsChangesToNexus: false,
            receivesChangesFromNexus: true
        },
        model: {
            controls: {
                activeNote: -1,
                tremoloFreq: 1,
                pitchFactor: 1
            }
        },
        components: {
            bonang: {
                type: "fluid.trackerSynth.bonang",
                options: {
                    model: {
                        activeNote: "{gpii.nexusBonangSynth}.model.controls.activeNote",
                        inputs: {
                            tremolo: {
                                freq: "{gpii.nexusBonangSynth}.model.controls.tremoloFreq"
                            }
                            /*,
                            pitchFactor: {
                                value: "{gpii.nexusBonangSynth}.model.controls.pitchFactor"
                            }*/
                        }
                    }
                }
            }
        }
    });

}());
