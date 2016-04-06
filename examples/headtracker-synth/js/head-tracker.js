(function () {
    "use strict";

    fluid.defaults("fluid.nexusAstericsHeadTracker", {
        gradeNames: "fluid.viewComponent",
        model: {
            // Normalized to 0 .. 1.0.
            position: {
                x: 0,
                y: 0
            },
            incomingRange: {
                start: -400,
                stop: 400
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
        that.websocket = new WebSocket("ws://localhost:9081/bindModel/nexus.asterics/inputs");
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
