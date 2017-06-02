/* global fluid, floe, jqUnit */

(function () {

    "use strict";

    fluid.defaults("gpii.tests.sensorPresentationPanelTests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            sensorPresentationPanel: {
                type: "gpii.nexusSensorVisualizationPanelMock",
                container: ".nexus-nexusSensorVisualizationPanel",
                createOnEvent: "{sensorPresentationPanelTester}.events.onTestCaseStart"
            },
            sensorPresentationPanelTester: {
                type: "gpii.tests.sensorPresentationPanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.sensorPresentationPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test presentation panel",
            tests: [{
                name: "Test presentation panel init",
                expect: 2,
                sequence: [{
                    func: "gpii.tests.sensorPresentationPanelTester.createSensor",
                    args: ["{sensorPresentationPanel}"]
                }]
            }]
        }]
    });

    gpii.tests.sensorPresentationPanelTester.createSensor = function (sensorPresentationPanel) {
        var fakeSensorPH = {
            "name": "Fake pH Sensor",
            "value": 7,
            "rangeMax": 14,
            "rangeMin": 0
        };

        sensorPresentationPanel.applier.change("sensors.fakeSensorPH",
        fakeSensorPH);

        jqUnit.assertTrue("attachedContainers array is at expected length", sensorPresentationPanel.attachedContainers.length > 0);

        jqUnit.assertNotUndefined("attachedSensors object contains fakeSensorPH", sensorPresentationPanel.attachedSensors.fakeSensorPH);

    };

    gpii.tests.sensorPresentationPanelTests();

}());
