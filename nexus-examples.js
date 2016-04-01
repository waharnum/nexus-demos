"use strict";

var nodeStatic = require("node-static");

var port = 8080;

var files = new nodeStatic.Server(__dirname);

require("http").createServer(function (request, response) {
    request.addListener("end", function () {
        files.serve(request, response);
    }).resume();
}).listen(port);
