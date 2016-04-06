var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../src/nexusUtils.js");

var nexusHost = "localhost";
var nexusPort = 9081;

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

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.bonang.synth", {
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

gpii.constructNexusPeer(nexusHost, nexusPort, "nexus.sensors", {
    type: "fluid.modelComponent",
    model: {
        orientation: { }
    }
});
