/* global fluid, jqUnit */

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
            name: "Test sensor presentation panel",
            tests: [{
                name: "Test presentation panel sensor create and remove behaviour",
                expect: 12,
                sequence: [{
                    func: "gpii.tests.sensorPresentationPanelTester.testCreateSensor",
                    args: ["{sensorPresentationPanel}"]
                },
                {
                  func: "gpii.tests.sensorPresentationPanelTester.testRemoveSensor",
                  args: ["{sensorPresentationPanel}"]
                }]
            }]
        },
        {
            name: "Test sensor ordering",
            tests: [{
                name: "Test presentation panel sensor ordering",
                expect: 8,
                sequence: [{
                    func: "gpii.tests.sensorPresentationPanelTester.testSensorOrdering",
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
      },
      fakeSensorAlpha: {
          "name": "Fake Alpha Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1
      },
      fakeSensorBeta: {
          "name": "Fake Beta Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1
      },
      fakeSensorGamma: {
          "name": "Fake Gamma Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1
      }
  };

    gpii.tests.sensorPresentationPanelTester.verifySensorContainer = function(sensorPresentationPanel, sensorContainerClass, verifyAbsence) {

        var verifyLength = verifyAbsence ? 0 : 1;

        var verifyText = verifyAbsence ? "absent" : "present";

        var sensorContainer = sensorPresentationPanel.container.find(sensorContainerClass);

        jqUnit.assertTrue("Container with class " + sensorContainerClass + " " + verifyText, sensorContainer.length === verifyLength);
    };

    gpii.tests.sensorPresentationPanelTester.testCreateSensor = function (sensorPresentationPanel) {

        // Add a first sensor
        sensorPresentationPanel.applier.change("sensors.fakeSensorPH",
        fakeSensors.fakeSensorPH);

        jqUnit.assertTrue("attachedContainers array is at expected length of 1", sensorPresentationPanel.attachedContainers.length === 1);

        jqUnit.assertNotUndefined("attachedSensors object contains fakeSensorPH", sensorPresentationPanel.attachedSensors.fakeSensorPH);

        // PH Sensor container is locatable
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, ".nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorPH");

        // Add a second sensor
        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature",
        fakeSensors.fakeSensorTemperature);

        // Temperature Sensor container is locatable
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, ".nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorTemperature");

        jqUnit.assertTrue("attachedContainers array is at expected length of 2", sensorPresentationPanel.attachedContainers.length === 2);

        jqUnit.assertNotUndefined("attachedSensors object contains fakeSensorTemperature", sensorPresentationPanel.attachedSensors.fakeSensorTemperature);

    };

    gpii.tests.sensorPresentationPanelTester.testRemoveSensor = function (sensorPresentationPanel) {
        sensorPresentationPanel.applier.change("sensors.fakeSensorPH", null, "DELETE");

        jqUnit.assertTrue("attachedContainers array is at expected length of 1", sensorPresentationPanel.attachedContainers.length === 1);

        jqUnit.assertUndefined("attachedSensors object does not contain fakeSensorPH", sensorPresentationPanel.attachedSensors.fakeSensorPH);

        // PH Sensor container is gone
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, ".nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorPH", true);

        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature", null, "DELETE");

        jqUnit.assertTrue("attachedContainers array is at expected length of 0", sensorPresentationPanel.attachedContainers.length === 0);

        jqUnit.assertUndefined("attachedSensors object does not contain fakeSensorTemperature", sensorPresentationPanel.attachedSensors.fakeSensorTemperature);

        // Temperature Sensor container is gone
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, ".nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorTemperature", true);

    };

    var sensorOrderSpecs = {
        betaFirst: [
            {name: fakeSensors.fakeSensorBeta.name}
        ],
        alphaFirstBetaSecond: [
            {name: fakeSensors.fakeSensorAlpha.name},
            {name: fakeSensors.fakeSensorBeta.name}
        ],
        alphaFirstBetaSecondGammaThird: [
            {name: fakeSensors.fakeSensorAlpha.name},
            {name: fakeSensors.fakeSensorBeta.name},
            {name: fakeSensors.fakeSensorGamma.name}
        ],
        alphaFirstGammaSecond: [
            {name: fakeSensors.fakeSensorAlpha.name},
            {name: fakeSensors.fakeSensorGamma.name}
        ]
    };

    gpii.tests.sensorPresentationPanelTester.verifySensorOrdering = function (sensorPresentationPanel, sensorOrderSpec) {
        fluid.each(sensorOrderSpec, function (sensor, idx) {
            jqUnit.assertEquals(sensor.name + " at position " + idx + " of attachedContainers array", sensorPresentationPanel.attachedContainers[idx].sensorName, sensor.name);
        });
    };

    gpii.tests.sensorPresentationPanelTester.testSensorOrdering = function (sensorPresentationPanel) {

        sensorPresentationPanel.applier.change("sensors.fakeSensorBeta",
        fakeSensors.fakeSensorBeta);

        gpii.tests.sensorPresentationPanelTester.verifySensorOrdering(sensorPresentationPanel, sensorOrderSpecs.betaFirst);

        var sensorContainers = sensorPresentationPanel.container.find( ".nexus-nexusSensorPresentationPanel-sensorDisplay");

        sensorPresentationPanel.applier.change("sensors.fakeSensorAlpha",
        fakeSensors.fakeSensorAlpha);

        gpii.tests.sensorPresentationPanelTester.verifySensorOrdering(sensorPresentationPanel, sensorOrderSpecs.alphaFirstBetaSecond);

        sensorPresentationPanel.applier.change("sensors.fakeSensorGamma",
        fakeSensors.fakeSensorGamma);

        gpii.tests.sensorPresentationPanelTester.verifySensorOrdering(sensorPresentationPanel, sensorOrderSpecs.alphaFirstBetaSecondGammaThird);

        sensorPresentationPanel.applier.change("sensors.fakeSensorBeta",
        null, "DELETE");

        gpii.tests.sensorPresentationPanelTester.verifySensorOrdering(sensorPresentationPanel, sensorOrderSpecs.alphaFirstGammaSecond);
    };

    gpii.tests.sensorPresentationPanelTests();

}());
