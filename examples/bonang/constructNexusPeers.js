var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../src/nexusUtils.js");

var nexusHost = "localhost";
var nexusPort = 9081;

var bonangPeerOptions = {
    type: "fluid.modelComponent",
    model: {
        activeNote: -1
    }
};

gpii.constructNexusPeer(nexusHost, nexusPort, "/bonang", bonangPeerOptions);
