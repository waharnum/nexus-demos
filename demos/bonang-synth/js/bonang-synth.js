(function () {
    "use strict";

    fluid.defaults("fluid.trackerSynth.bonang", {
        gradeNames: "flock.modelSynth",

        numNotes: 15,

        // Sample is midi note 82.4
        rootSpeed: flock.midiFreq(0) / flock.midiFreq(82.4),

        scales: {
            harrisonPelog: [1/1, 35/32, 5/4, 21/16, 49/32, 105/64, 7/4, 2/1]
        },

        pathets: {
            lima: [0, 1, 2, 4, 5],
            barang: [1, 2, 4, 5, 6]
        },

        midi2harrison: {
            0:  1/1,    // C
            1:  0,      // C#
            2:  35/32,  // D
            3:  0,      // D#
            4:  5/4,    // E
            5:  21/16,  // F
            6:  0,      // F#
            7:  49/32,  // G
            8:  0,      // G#
            9:  105/64, // A
            10: 7/4,    // A#
            11: 0       // B
        },

        model: {
            activeNote: -1,

            inputs: {
                player: {
                    trigger: {
                        source: 0.0
                    },

                    speed: 1.0
                },
                tremolo: {
                    freq: 1
                }
            },

            speeds: {
                expander: {
                    funcName: "fluid.trackerSynth.bonang.noteSpeedsForMidi",
                    args: [
                        "{that}.options.midi2harrison",
                        "{that}.options.rootSpeed"
                    ]
                }
            }
        },

        synthDef: {
            id: "player",
            ugen: "flock.ugen.triggerBuffers",
            options: {
                bufferIDs: ["bonang"],
                interpolation: "cubic"
            },
            trigger: {
                ugen: "flock.ugen.valueChangeTrigger",
                options: {
                    triggerOnSetSameValue: false
                },
                source: 0
            },
            mul: {
                id: "tremolo",
                ugen: "flock.ugen.sinOsc",
                freq: 1,
                add: 0.5,
                mul: 0.5
            }
        },

        components: {
            bufferLoader: {
                type: "fluid.trackerSynth.bonang.bufferLoader"
            }
        },

        modelListeners: {
            activeNote: [
                "fluid.trackerSynth.bonang.onNoteChange({change}.value, {that})"
            ]
        }
    });

    fluid.trackerSynth.bonang.noteSpeeds = function (options) {
        var scale = options.scales.harrisonPelog, // TODO: Hardcoded!
            pathet = options.pathets.lima, // TODO: Hardcoded!
            rootSpeed = options.rootSpeed,
            numOctaves = options.numNotes / pathet.length,
            noteSpeeds = [];

        for (var octave = 1; octave <= numOctaves; octave++) {
            for (var degree = 0; degree < pathet.length; degree++) {
                noteSpeeds.push(rootSpeed * scale[degree] * octave);
            }
        }

        return noteSpeeds;
    };

    fluid.trackerSynth.bonang.noteSpeedsForMidi = function (scale, rootSpeed) {
        var noteSpeeds = [];

        // Calculate note speeds for midi notes 0 to 119
        for (var octave = 0; octave < 10; octave++) {
            for (var note = 0; note < 12; note++) {
                var midiNoteNumber = (octave * 12) + note;
                noteSpeeds[midiNoteNumber] = Math.pow(2, octave) * rootSpeed * scale[note];
            }
        }

        return noteSpeeds;
    };

    fluid.trackerSynth.bonang.onNoteChange = function (activeNote, that) {
        // TODO: With a bit of thought, this can be entirely modelized, which is great!
        var changeSpec = {
            trigger: {
                source: activeNote + 1 // An "open" trigger is > 0.0.
            },

            speed: activeNote >= 0 ? that.model.speeds[activeNote] : 0.0
        };

        that.applier.change("inputs.player", changeSpec);
    };

    fluid.defaults("fluid.trackerSynth.bonang.bufferLoader", {
        gradeNames: "flock.bufferLoader",

        bufferDefs: [
            {
                id: "bonang",
                src: "audio/bonang-pelog-6.mp3"
            }
        ],

        listeners: {
            afterBuffersLoaded: [
                "{that}.enviro.play()"
            ]
        }
    });
}());
