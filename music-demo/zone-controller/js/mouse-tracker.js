(function () {
    "use strict";

    fluid.defaults("fluid.mouseTracker", {
        gradeNames: "fluid.viewComponent",

        model: {
            // Normalized to 0 .. 1.0.
            position: {
                x: 0,
                y: 0
            },

            bounds: {
                height: 1,
                width: 1
            }
        },

        axisMap: {
            x: {
                eventProp: "clientX",
                modelProp: "width"
            },

            y: {
                eventProp: "clientY",
                modelProp: "height"
            }
        },

        events: {
            onMove: null
        },

        listeners: {
            onCreate: [
                {
                    "this": "{that}.container",
                    method: "on",
                    args: ["mousemove", "{that}.events.onMove.fire"]
                }
            ],

            onMove: [
                {
                    funcName: "fluid.mouseTracker.applyNormalizedPosition",
                    args: [
                        "{arguments}.0",
                        "{that}.options.axisMap",
                        "{that}.model.bounds",
                        "{that}.applier"
                    ]
                }
            ]
        }
    });

    fluid.mouseTracker.normalizePositionOnAxis = function (evt, axisSpec, bounds) {
        return evt[axisSpec.eventProp] / bounds[axisSpec.modelProp];
    };

    fluid.mouseTracker.normalizePosition = function (evt, axisMap, bounds) {
        return fluid.transform(axisMap, function (axisSpec) {
            return fluid.mouseTracker.normalizePositionOnAxis(evt, axisSpec, bounds);
        });
    };

    fluid.mouseTracker.applyNormalizedPosition = function (evt, axisMap, bounds, applier) {
        var newPosition = fluid.mouseTracker.normalizePosition(evt, axisMap, bounds);
        applier.change("position", newPosition);
    };
}());
