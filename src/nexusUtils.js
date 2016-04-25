"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
var http = require("http");

gpii.constructNexusPeer = function (host, port, componentPath, componentOptions) {
    var postOptions = {
        host: host,
        port: port,
        method: "POST",
        path: "/components/" + componentPath,
        headers: {
            "Content-Type": "application/json"
        }
    };

    var promise = fluid.promise();

    var req = http.request(postOptions, function () {
        promise.resolve(null);
    });

    req.write(JSON.stringify(componentOptions));
    req.end();

    return promise;
};
