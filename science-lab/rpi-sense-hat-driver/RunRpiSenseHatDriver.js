"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");
require("./RpiSenseHatDriver.js");

var program = require("commander");

var nexusHost = "localhost";
var nexusPort = 9081;

program
    .option("-h, --host <hostname>", "Nexus hostname")
    .option("-p, --port <port>", "Nexus port number", parseInt)
    .parse(process.argv);

if (program.host) {
    nexusHost = program.host;
}

if (program.port) {
    nexusPort = program.port;
}

gpii.nexus.rpiSenseHatDriver({
    nexusHost: nexusHost,
    nexusPort: nexusPort    
});
