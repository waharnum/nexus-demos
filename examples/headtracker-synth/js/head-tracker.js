(function () {
    "use strict";

    fluid.defaults("fluid.nexusAstericsHeadTracker", {
        gradeNames: "fluid.viewComponent",
        members: {
            nexusHost: "localhost",
            nexusPort: 9081
        },
        model: {
            // Normalized to 0 .. 1.0.
            position: {
                x: 0,
                y: 0
            },
            incomingRange: {
                start: -500,
                stop: 500
            }
        },
        invokers: {
            messageListener: {
                funcName: "fluid.nexusAstericsHeadTracker.messageListener",
                args: [
                    "{arguments}.0",
                    "{that}.model.incomingRange",
                    "{that}.applier"
                ]
            }
        },
        listeners: {
            onCreate: {
                funcName: "fluid.nexusAstericsHeadTracker.bindModel",
                args: [ "{that}", "{that}.messageListener" ]
            }
        }
    });

    fluid.nexusAstericsHeadTracker.bindModel = function (that, messageListener) {
        var bindModelUrl = fluid.stringTemplate("ws://%host:%port/bindModel/nexus.asterics/connector.inputs", {
            host: that.nexusHost,
            port: that.nexusPort
        });
        that.websocket = new WebSocket(bindModelUrl);
        that.websocket.onmessage = messageListener;
    };

    fluid.nexusAstericsHeadTracker.messageListener = function (evt, incomingRange, applier) {
        var inputs = JSON.parse(evt.data);
        var newPosition = {
            x: fluid.nexusAstericsHeadTracker.normalizeAndClamp(incomingRange.start, incomingRange.stop, inputs.a),
            y: fluid.nexusAstericsHeadTracker.normalizeAndClamp(incomingRange.start, incomingRange.stop, inputs.b)
        };
        applier.change("position", newPosition);
    };

    fluid.nexusAstericsHeadTracker.normalizeAndClamp =  function (start, stop, val) {
        var result = (val - start) / (stop - start);
        if (result < 0) {
            result = 0;
        } else if (result > 1) {
            result = 1;
        }
        return result;
    };

}());
