var static = require("node-static");

var port = 8080;

var files = new static.Server("./public");

require("http").createServer(function (request, response) {
    request.addListener("end", function () {
        files.serve(request, response);
    }).resume();
}).listen(port);
