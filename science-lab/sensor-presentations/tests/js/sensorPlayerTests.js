/* global fluid, jqUnit */

(function () {

    "use strict";

    var transformTestSpecs = [
        {
            inputValue: 50,
            inputScaleMax: 100,
            inputScaleMin: 0,
            outputScaleMax: 680,
            outputScaleMin: 200,
            expectedOutputValues: {
                "gpii.sensorPlayer.transforms.minMaxScale": 440,
                "gpii.sensorPlayer.transforms.polarityScale": 200
            }
        },
        {
            inputValue: 100,
            inputScaleMax: 100,
            inputScaleMin: 0,
            outputScaleMax: 680,
            outputScaleMin: 200,
            expectedOutputValues: {
                "gpii.sensorPlayer.transforms.minMaxScale": 680,
                "gpii.sensorPlayer.transforms.polarityScale": 680
            }
        },
        {
            inputValue: 0,
            inputScaleMax: 100,
            inputScaleMin: 0,
            outputScaleMax: 680,
            outputScaleMin: 200,
            expectedOutputValues: {
                "gpii.sensorPlayer.transforms.minMaxScale": 200,
                "gpii.sensorPlayer.transforms.polarityScale": 680
            }
        }
    ];

    var testTransforms = function (transformType) {
        jqUnit.test("Test min/max scaling transform", function() {
            jqUnit.expect(3);
            fluid.each(transformTestSpecs, function (testSpec) {

                var transformDef = {
                    input: {
                        transform: {
                            type: transformType,
                            input: testSpec.inputValue,
                            inputScaleMax: testSpec.inputScaleMax,
                            inputScaleMin: testSpec.inputScaleMin,
                            outputScaleMax: testSpec.outputScaleMax,
                            outputScaleMin: testSpec.outputScaleMin
                        }
                    }
                };

                var result = fluid.model.transformWithRules({}, transformDef);
                var testMessage = fluid.stringTemplate("%transformType output is expexcted value of %expectedOutput when input is %input",
                    {
                    transformType: transformDef.input.transform.type,
                    expectedOutput: testSpec.expectedOutputValues[transformType],
                    input: testSpec.inputValue
                    }
                );
                jqUnit.assertEquals(testMessage, testSpec.expectedOutputValues[transformType], result.input);
            });
        });
    };

    testTransforms("gpii.sensorPlayer.transforms.minMaxScale");

    testTransforms("gpii.sensorPlayer.transforms.polarityScale");

}());
