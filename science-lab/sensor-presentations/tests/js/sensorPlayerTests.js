/* global fluid, jqUnit */

(function () {

    "use strict";

    var transformTestSpecs = [
        {
            message: "Positive values, midpoint input",
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
            message: "Positive values, maximum input",
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
            message: "Positive values, minimum input",
            inputValue: 0,
            inputScaleMax: 100,
            inputScaleMin: 0,
            outputScaleMax: 680,
            outputScaleMin: 200,
            expectedOutputValues: {
                "gpii.sensorPlayer.transforms.minMaxScale": 200,
                "gpii.sensorPlayer.transforms.polarityScale": 680
            }
        },
        {
            message: "Positive values, above maximum input (should clamp)",
            inputValue: 101,
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
            message: "Positive values, below minimum input (should clamp)",
            inputValue: -1,
            inputScaleMax: 100,
            inputScaleMin: 0,
            outputScaleMax: 680,
            outputScaleMin: 200,
            expectedOutputValues: {
                "gpii.sensorPlayer.transforms.minMaxScale": 200,
                "gpii.sensorPlayer.transforms.polarityScale": 680
            }
        },
        {
            message: "Negative and positive values, midpoint input",
            inputValue: 0,
            inputScaleMax: 25,
            inputScaleMin: -25,
            outputScaleMax: 100,
            outputScaleMin: -100,
            expectedOutputValues: {
                "gpii.sensorPlayer.transforms.minMaxScale": 0,
                "gpii.sensorPlayer.transforms.polarityScale": -100
            }
        }
    ];

    var testTransforms = function (transformType, testSpecs) {
        jqUnit.test("Test transforms - " + transformType, function() {
            jqUnit.expect(6);
            fluid.each(testSpecs, function (testSpec) {

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
                var testMessage = fluid.stringTemplate("%message - %transformType output is expected value of %expectedOutput when input is %input. Input min/max: %inputMin / %inputMax, output min/max: %outputMin / %outputMax",
                    {
                    transformType: transformDef.input.transform.type,
                    expectedOutput: testSpec.expectedOutputValues[transformType],
                    input: testSpec.inputValue,
                    message: testSpec.message,
                    inputMin: testSpec.inputScaleMin,
                    inputMax: testSpec.inputScaleMax,
                    outputMin: testSpec.outputScaleMin,
                    outputMax: testSpec.outputScaleMax
                    }
                );
                jqUnit.assertEquals(testMessage, testSpec.expectedOutputValues[transformType], result.input);
            });
        });
    };

    testTransforms("gpii.sensorPlayer.transforms.minMaxScale", transformTestSpecs);

    testTransforms("gpii.sensorPlayer.transforms.polarityScale", transformTestSpecs);

}());
