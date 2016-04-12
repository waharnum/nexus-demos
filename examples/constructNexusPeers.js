var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../src/nexusUtils.js");

var nexusHost = "localhost";
var nexusPort = 9081;

var zoneControllerMidiBase = 60;
var midiLima = [
    0,  // C 1/1
    2,  // D 35/32
    4,  // E 5/4
    7,  // G 49/32
    9   // A 105/64
];

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus", {
    type: "fluid.modelComponent"
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.asterics", {
    type: "fluid.modelComponent",
    model: {
        inputs: {
            a: 0,
            b: 0,
            c: 0,
            d: 0
        }
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.bonang", {
    type: "fluid.modelComponent"
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.bonang.control", {
    type: "fluid.modelComponent",
    model: {
        activeNote: -1
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.bonang.zoneController", {
    type: "fluid.modelComponent",
    model: {
        activeZoneIdx: -1
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.bonang.pianoController", {
    type: "fluid.modelComponent",
    model: {
        activeNote: -1
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.sensors", {
    type: "fluid.modelComponent",
    model: {
        orientation: { }
    },
    modelRelay: {
        source: "{that}.model.orientation.gamma",
        target: "orientation.gammaAbs",
        singleTransform: {
            type: "Math.abs"
        }
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.bonang.synth", {
    type: "fluid.modelComponent",
    modelRelay: [
        {
            source: "{control}.model.activeNote",
            target: "controls.activeNote",
            singleTransform: {
                type: "fluid.transforms.identity"
            },
            forward: "always",
            backward: "never"
        },
        {
            source: "{pianoController}.model.activeNote",
            target: "controls.activeNote",
            singleTransform: {
                type: "fluid.transforms.identity"
            },
            forward: "always",
            backward: "never"
        },
        {
            source: "{zoneController}.model.activeZoneIdx",
            target: "controls.activeNote",
            singleTransform: {
                type: "fluid.transforms.valueMapper",
                inputPath: "",
                options: [
                    { inputValue: -1, outputValue: -1 },
                    { inputValue: 0, outputValue: zoneControllerMidiBase + midiLima[0] },
                    { inputValue: 1, outputValue: zoneControllerMidiBase + midiLima[1] },
                    { inputValue: 2, outputValue: zoneControllerMidiBase + midiLima[2] },
                    { inputValue: 3, outputValue: zoneControllerMidiBase + midiLima[3] },
                    { inputValue: 4, outputValue: zoneControllerMidiBase + midiLima[4] },
                    { inputValue: 5, outputValue: zoneControllerMidiBase + 12 + midiLima[0] },
                    { inputValue: 6, outputValue: zoneControllerMidiBase + 12 + midiLima[1] },
                    { inputValue: 7, outputValue: zoneControllerMidiBase + 12 + midiLima[2] },
                    { inputValue: 8, outputValue: zoneControllerMidiBase + 12 + midiLima[3] },
                    { inputValue: 9, outputValue: zoneControllerMidiBase + 12 + midiLima[4] },
                    { inputValue: 10, outputValue: zoneControllerMidiBase + 24 + midiLima[0] },
                    { inputValue: 11, outputValue: zoneControllerMidiBase + 24 + midiLima[1] },
                    { inputValue: 12, outputValue: zoneControllerMidiBase + 24 + midiLima[2] },
                    { inputValue: 13, outputValue: zoneControllerMidiBase + 24 + midiLima[3] },
                    { inputValue: 14, outputValue: zoneControllerMidiBase + 24 + midiLima[4] }
                ]
            },
            forward: "always",
            backward: "never"
        },
        {
            source: "{sensors}.model.orientation.gammaAbs",
            target: "controls.tremoloFreq",
            singleTransform: {
                type: "fluid.transforms.linearScale",
                factor: 0.2
            },
            forward: "liveOnly",
            backward: "never"
        },
        {
            source: "{asterics}.model.inputs.c",
            target: "controls.pitchFactor",
            singleTransform: {
                type: "fluid.transforms.linearScale",
                factor: 1/100,
                offset: -128/100
            },
            forward: "liveOnly",
            backward: "never"
        }
    ]
});
