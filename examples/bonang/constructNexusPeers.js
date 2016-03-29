var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../src/nexusUtils.js");

var nexusHost = "localhost";
var nexusPort = 9081;

gpii.constructNexusPeer(nexusHost, nexusPort, "bonang", {
    type: "fluid.modelComponent"
});

gpii.constructNexusPeer(nexusHost, nexusPort, "bonang.control", {
    type: "fluid.modelComponent",
    model: {
        activeNote: -1
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "bonang.zoneController", {
    type: "fluid.modelComponent",
    model: {
        activeZoneIdx: -1
    }
});

gpii.constructNexusPeer(nexusHost, nexusPort, "bonang.synth", {
    type: "fluid.modelComponent",
    modelRelay: [
        {
            source: "{control}.model.activeNote",
            target: "activeNote",
            singleTransform: {
                type: "fluid.transforms.identity"
            },
            forward: "always",
            backward: "never"
        },
        {
            source: "{zoneController}.model.activeZoneIdx",
            target: "activeNote",
            singleTransform: {
                type: "fluid.transforms.identity"
            },
            forward: "always",
            backward: "never"
        }
    ]
});
