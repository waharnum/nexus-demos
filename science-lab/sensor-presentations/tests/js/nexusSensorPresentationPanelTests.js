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
                name: "Test presentation panel create and delete behaviour",
                expect: 8,
                sequence: [{
                    func: "gpii.tests.sensorPresentationPanelTester.testCreateSensor",
                    args: ["{sensorPresentationPanel}"]
                },
                {
                  func: "gpii.tests.sensorPresentationPanelTester.testRemoveSensor",
                  args: ["{sensorPresentationPanel}"]
                }]
            }]
        }]
    });

    // Fake sensor definitions for use in testing
    var fakeSensors = {
      fakeSensorPH: {
          "name": "Fake pH Sensor",
          "value": 7,
          "rangeMax": 14,
          "rangeMin": 0
      },
      fakeSensorTemperature: {
          "name": "Fake Temperature Sensor",
          "value": 15,
          "rangeMax": 50,
          "rangeMin": 0
      }
    }

    gpii.tests.sensorPresentationPanelTester.testCreateSensor = function (sensorPresentationPanel) {


        sensorPresentationPanel.applier.change("sensors.fakeSensorPH",
        fakeSensors.fakeSensorPH);

        jqUnit.assertTrue("attachedContainers array is at expected length of 1", sensorPresentationPanel.attachedContainers.length === 1);

        jqUnit.assertNotUndefined("attachedSensors object contains fakeSensorPH", sensorPresentationPanel.attachedSensors.fakeSensorPH);

        // Add a second sensor
        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature",
        fakeSensors.fakeSensorTemperature);

        jqUnit.assertTrue("attachedContainers array is at expected length of 2", sensorPresentationPanel.attachedContainers.length === 2);

        jqUnit.assertNotUndefined("attachedSensors object contains fakeSensorTemperature", sensorPresentationPanel.attachedSensors.fakeSensorTemperature);

    };

    gpii.tests.sensorPresentationPanelTester.testRemoveSensor = function (sensorPresentationPanel) {
      sensorPresentationPanel.applier.change("sensors.fakeSensorPH", null, "DELETE");

      jqUnit.assertTrue("attachedContainers array is at expected length of 1", sensorPresentationPanel.attachedContainers.length === 1);

      jqUnit.assertUndefined("attachedSensors object does not contain fakeSensorPH", sensorPresentationPanel.attachedSensors.fakeSensorPH);

      sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature", null, "DELETE");

      jqUnit.assertTrue("attachedContainers array is at expected length of 0", sensorPresentationPanel.attachedContainers.length === 0);

      jqUnit.assertUndefined("attachedSensors object does not contain fakeSensorTemperature", sensorPresentationPanel.attachedSensors.fakeSensorTemperature);


    };

    gpii.tests.sensorPresentationPanelTests();

}());
