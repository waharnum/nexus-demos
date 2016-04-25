/*global flock, QwertyHancock*/

(function () {

    "use strict";

    fluid.defaults("flock.ui.keyboard", {
        gradeNames: "fluid.viewComponent",

        qwertyHancockOptions: {
            width: 1024,
            height: 300,
            startNote: "C6",
            octaves: 2
        },

        velocity: 127,

        members: {
            qwertyHancock: {
                expander: {
                    funcName: "flock.ui.keyboard.createQwertyHancock",
                    args: ["{that}"]
                }
            }
        },

        events: {
            noteOn: null,
            noteOff: null
        },

        listeners: {
            onCreate: [
                "flock.ui.keyboard.addClasses({that}.dom.keys, {that}.options.styles)",
                "flock.ui.keyboard.bindQwertyHancockEvents({that})"
            ]
        },

        selectors: {
            keys: "li"
        },

        styles: {
            black: "flock-keyboard-blackKey",
            white: "flock-keyboard-whiteKey"
        }
    });

    flock.ui.keyboard.addClasses = function (keys, styles) {
        fluid.each(keys, function (key) {
            key = $(key);
            var keyType = key.attr("data-note-type");
            key.addClass(styles[keyType]);
        });
    };

    flock.ui.keyboard.createQwertyHancock = function (that) {
        var opts = fluid.copy(that.options.qwertyHancockOptions);
        if (!opts.id) {
            var id = fluid.allocateSimpleId(that.container);
            opts.id = id;
        }

        return new QwertyHancock(opts);
    };

    flock.ui.keyboard.fireMidiEvent = function (that, type, midiString) {
        var noteSpec = {
            type: type,
            chan: 0,
            note: flock.parseMidiString(midiString),
            velocity: that.options.velocity
        };

        that.events[type].fire(noteSpec);
    };

    flock.ui.keyboard.bindQwertyHancockEvents = function (that) {
        that.qwertyHancock.keyDown = function (midiString) {
            flock.ui.keyboard.fireMidiEvent(that, "noteOn", midiString);
        };

        that.qwertyHancock.keyUp =  function (midiString) {
            flock.ui.keyboard.fireMidiEvent(that, "noteOff", midiString);
        };
    };

    fluid.defaults("flock.ui.modelKeyboard", {
        gradeNames: ["fluid.modelComponent", "flock.ui.keyboard"],

        model: {
            activeNote: -1
        },

        listeners: {
            noteOn: [
                {
                    changePath: "activeNote",
                    value: "{arguments}.0.note"
                }
            ],

            noteOff: [
                {
                    changePath: "activeNote",
                    value: -1
                }
            ]
        }
    });

    fluid.defaults("gpii.nexusPianoController", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "flock.ui.modelKeyboard"],

        highlightKeys: [
            "C6",
            "D6",
            "E6",
            "F6",
            "G6",
            "A6",
            "A#6"
        ],

        members: {
            nexusPeerComponentPath: "nexus.bonang.pianoController",
            nexusBoundModelPath: "activeNote",
            sendsChangesToNexus: true,
            receivesChangesFromNexus: false
        },

        listeners: {
            onCreate: [
                {
                    funcName: "gpii.nexusPianoController.highlightKeys",
                    args: ["{that}.container", "{that}.options"],
                    priority: "last"
                }
            ]
        },

        styles: {
            highlightedKey: "gpii-nexusPianoController-highlighted-key"
        }
    });

    gpii.nexusPianoController.highlightKeys = function (container, options) {
        fluid.each(options.highlightKeys, function (key) {
            container.find("[id=" + key + "]").addClass(options.styles.highlightedKey);
        });
    };
}());
