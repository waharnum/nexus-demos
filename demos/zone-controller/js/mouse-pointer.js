(function () {
    "use strict";

    fluid.defaults("fluid.trackerSynth.pointer", {
        gradeNames: "fluid.viewComponent",

        model: {
            position: {
                relative: {
                    x: 0,
                    y: 0
                },

                absolute: {
                    left: 0,
                    top: 0
                }
            },

            bounds: {
                width: 0,
                height: 0
            }
        },

        modelRelay: [
            {
                target: "{that}.model.position.absolute.left",
                singleTransform: {
                    type: "fluid.transforms.binaryOp",
                    left: "{that}.model.position.relative.x",
                    operator: "*",
                    right: "{that}.model.bounds.width"
                }
            },
            {
                target: "{that}.model.position.absolute.top",
                singleTransform: {
                    type: "fluid.transforms.binaryOp",
                    left: "{that}.model.position.relative.y",
                    operator: "*",
                    right: "{that}.model.bounds.height"
                }
            }
        ],

        modelListeners: {
            "position.absolute": [
                {
                    "this": "{that}.container",
                    method: "css",
                    args: ["{change}.value"]
                }
            ]
        }
    });
}());
