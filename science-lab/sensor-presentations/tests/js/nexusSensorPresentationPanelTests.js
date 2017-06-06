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
                expect: 20,
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
          "rangeMin": 0,
          "containerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorPH"
      },
      fakeSensorTemperature: {
          "name": "Fake Temperature Sensor",
          "value": 15,
          "rangeMax": 50,
          "rangeMin": 0,
          "containerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorTemperature"
      },
      fakeSensorAlpha: {
          "name": "Fake Alpha Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1,
          "containerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorAlpha"
      },
      fakeSensorBeta: {
          "name": "Fake Beta Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1,
          "containerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorBeta"
      },
      fakeSensorGamma: {
          "name": "Fake Gamma Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1,
          "containerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorGamma"
      }
  };

    gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking = function (sensorPresentationPanel, sensorKey, verifyAbsence) {

        var verifyFunction = verifyAbsence ? "assertUndefined" : "assertNotUndefined";

        var verifyText = verifyAbsence ? "does not contain" : "contains";

        jqUnit[verifyFunction]("attachedSensors object " + verifyText + " " + sensorKey, sensorPresentationPanel.attachedSensors[sensorKey]);
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

        gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking(sensorPresentationPanel, "fakeSensorPH");

        // PH Sensor container is locatable
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, "." + fakeSensors.fakeSensorPH.containerClass);

        // Add a second sensor
        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature",
        fakeSensors.fakeSensorTemperature);

        // Temperature Sensor container is locatable
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, "." + fakeSensors.fakeSensorTemperature.containerClass);

        jqUnit.assertTrue("attachedContainers array is at expected length of 2", sensorPresentationPanel.attachedContainers.length === 2);

        gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking(sensorPresentationPanel, "fakeSensorTemperature");

    };

    gpii.tests.sensorPresentationPanelTester.testRemoveSensor = function (sensorPresentationPanel) {
        sensorPresentationPanel.applier.change("sensors.fakeSensorPH", null, "DELETE");

        jqUnit.assertTrue("attachedContainers array is at expected length of 1", sensorPresentationPanel.attachedContainers.length === 1);

        gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking(sensorPresentationPanel, "fakeSensorPH", true);

        // PH Sensor container is gone
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, "." + fakeSensors.fakeSensorPH.containerClass, true);

        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature", null, "DELETE");

        jqUnit.assertTrue("attachedContainers array is at expected length of 0", sensorPresentationPanel.attachedContainers.length === 0);

        gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking(sensorPresentationPanel, "fakeSensorTemperature", true);

        // Temperature Sensor container is gone
        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, "." + fakeSensors.fakeSensorTemperature.containerClass, true);

    };

    var sensorOrderSpecs = {
        betaFirst: [
            fakeSensors.fakeSensorBeta
        ],
        alphaFirstBetaSecond: [
            fakeSensors.fakeSensorAlpha,
            fakeSensors.fakeSensorBeta
        ],
        alphaFirstBetaSecondGammaThird: [
            fakeSensors.fakeSensorAlpha,
            fakeSensors.fakeSensorBeta,
            fakeSensors.fakeSensorGamma
        ],
        alphaFirstGammaSecond: [
            fakeSensors.fakeSensorAlpha,
            fakeSensors.fakeSensorGamma
        ]
    };

    gpii.tests.sensorPresentationPanelTester.verifySensorOrdering = function (sensorPresentationPanel, sensorOrderSpec) {

        var sensorContainers = sensorPresentationPanel.container.find( ".nexus-nexusSensorPresentationPanel-sensorDisplay");

        jqUnit.assertTrue("Number of sensor containers as expected", sensorContainers.length === sensorOrderSpec.length);

        fluid.each(sensorOrderSpec, function (sensor, idx) {

            jqUnit.assertEquals(sensor.name + " at position " + idx + " of attachedContainers array", sensorPresentationPanel.attachedContainers[idx].sensorName, sensor.name);

            jqUnit.assertTrue("Sensor container at position " + idx + " in DOM ordering has expected class of " + sensor.containerClass, $(sensorContainers[idx]).hasClass(sensor.containerClass));

        });
    };

    gpii.tests.sensorPresentationPanelTester.testSensorOrdering = function (sensorPresentationPanel) {

        sensorPresentationPanel.applier.change("sensors.fakeSensorBeta",
        fakeSensors.fakeSensorBeta);

        gpii.tests.sensorPresentationPanelTester.verifySensorOrdering(sensorPresentationPanel, sensorOrderSpecs.betaFirst);

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
