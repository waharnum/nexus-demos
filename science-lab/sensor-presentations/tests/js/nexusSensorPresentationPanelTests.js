/* global fluid, jqUnit */

(function () {

    "use strict";

    fluid.defaults("gpii.tests.sensorPresentationPanelTests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            sensorPresentationPanelTester: {
                type: "gpii.tests.sensorPresentationPanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.sensorVisualizationPanelTests", {
        gradeNames: ["gpii.tests.sensorPresentationPanelTests"],

        components: {
            sensorPresentationPanel: {
                type: "gpii.nexusSensorVisualizationPanelMock",
                container: ".nexus-nexusSensorVisualizationPanel",
                createOnEvent: "{sensorPresentationPanelTester}.events.onTestCaseStart",
                options: {
                    containerClassKey: "visualizerClass"
                }
            },
            sensorPresentationPanelTester: {
                type: "gpii.tests.sensorVisualizationPanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.sensorSonificationPanelTests", {
        gradeNames: ["gpii.tests.sensorPresentationPanelTests"],
        components: {
            sensorPresentationPanel: {
                type: "gpii.nexusSensorSonificationPanelMock",
                container: ".nexus-nexusSensorSonificationPanel",
                createOnEvent: "{sensorPresentationPanelTester}.events.onTestCaseStart",
                options: {
                    containerClassKey: "sonifierClass"
                }
            },
            sensorPresentationPanelTester: {
                type: "gpii.tests.sensorSonificationPanelTester"
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

    fluid.defaults("gpii.tests.sensorVisualizationPanelTester", {
        gradeNames: ["gpii.tests.sensorPresentationPanelTester"],
        modules: [{
            name: "Test sensor visualization panel"
        },
        {
            name: "Test sensor visualization panel ordering"
        }]
    });

    fluid.defaults("gpii.tests.sensorSonificationPanelTester", {
        gradeNames: ["gpii.tests.sensorPresentationPanelTester"],
        modules: [{
            name: "Test sensor sonification panel"
        },
        {
            name: "Test sensor sonification panel ordering"
        }]
    });

    // Fake sensor definitions for use in testing
    var fakeSensors = {
      fakeSensorPH: {
          "name": "Fake pH Sensor",
          "value": 7,
          "rangeMax": 14,
          "rangeMin": 0,
          "visualizerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorPH",
          "sonifierClass": "nexus-nexusSensorSonificationPanel-sensorDisplay-fakeSensorPH"
      },
      fakeSensorTemperature: {
          "name": "Fake Temperature Sensor",
          "value": 15,
          "rangeMax": 50,
          "rangeMin": 0,
          "visualizerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorTemperature",
          "sonifierClass": "nexus-nexusSensorSonificationPanel-sensorDisplay-fakeSensorTemperature"
      },
      fakeSensorAlpha: {
          "name": "Fake Alpha Sensor",
          "value": 6,
          "rangeMax": 10,
          "rangeMin": 1,
          "visualizerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorAlpha",
          "sonifierClass": "nexus-nexusSensorSonificationPanel-sensorDisplay-fakeSensorAlpha"
      },
      fakeSensorBeta: {
          "name": "Fake Beta Sensor",
          "value": 3,
          "rangeMax": 10,
          "rangeMin": 1,
          "visualizerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorBeta",
          "sonifierClass": "nexus-nexusSensorSonificationPanel-sensorDisplay-fakeSensorBeta"
      },
      fakeSensorGamma: {
          "name": "Fake Gamma Sensor",
          "value": 8,
          "rangeMax": 10,
          "rangeMin": 1,
          "visualizerClass": "nexus-nexusSensorVisualizationPanel-sensorDisplay-fakeSensorGamma",
          "sonifierClass": "nexus-nexusSensorSonificationPanel-sensorDisplay-fakeSensorGamma"
      }
  };

    gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking = function (sensorPresentationPanel, sensorKey, verifyAbsence) {

        var verifyFunction = verifyAbsence ? "assertUndefined" : "assertNotUndefined";

        var verifyText = verifyAbsence ? "does not contain" : "contains";

        jqUnit[verifyFunction]("attachedSensors object " + verifyText + " " + sensorKey, sensorPresentationPanel.attachedSensors[sensorKey]);
    };

    gpii.tests.sensorPresentationPanelTester.verifySensorContainer = function(sensorPresentationPanel, sensorvisualizerClass, verifyAbsence) {

        var verifyLength = verifyAbsence ? 0 : 1;

        var verifyText = verifyAbsence ? "absent" : "present";

        var sensorContainer = sensorPresentationPanel.container.find(sensorvisualizerClass);

        jqUnit.assertTrue("Container with class " + sensorvisualizerClass + " " + verifyText, sensorContainer.length === verifyLength);
    };

    gpii.tests.sensorPresentationPanelTester.verifySensorPresenterCreation = function (sensorPresentationPanel, sensorKey, expectedAttachedContainersLength) {

        var containerClassKey = sensorPresentationPanel.options.containerClassKey;

        gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking(sensorPresentationPanel, sensorKey);

        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, "." + fakeSensors[sensorKey][containerClassKey]);

        jqUnit.assertTrue("attachedContainers array is at expected length of " + expectedAttachedContainersLength, sensorPresentationPanel.attachedContainers.length === expectedAttachedContainersLength);
    };

    gpii.tests.sensorPresentationPanelTester.verifySensorPresenterRemoval = function (sensorPresentationPanel, sensorKey, expectedAttachedContainersLength) {

        var containerClassKey = sensorPresentationPanel.options.containerClassKey;

        gpii.tests.sensorPresentationPanelTester.verifyAttachedSensorTracking(sensorPresentationPanel, sensorKey, true);

        gpii.tests.sensorPresentationPanelTester.verifySensorContainer(sensorPresentationPanel, "." + fakeSensors[sensorKey][containerClassKey], true);

        jqUnit.assertTrue("attachedContainers array is at expected length of " + expectedAttachedContainersLength, sensorPresentationPanel.attachedContainers.length === expectedAttachedContainersLength);
    };

    gpii.tests.sensorPresentationPanelTester.testCreateSensor = function (sensorPresentationPanel) {

        // Add a first sensor
        sensorPresentationPanel.applier.change("sensors.fakeSensorPH",
        fakeSensors.fakeSensorPH);

        gpii.tests.sensorPresentationPanelTester.verifySensorPresenterCreation(sensorPresentationPanel, "fakeSensorPH", 1);

        // Add a second sensor
        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature",
        fakeSensors.fakeSensorTemperature);

        gpii.tests.sensorPresentationPanelTester.verifySensorPresenterCreation(sensorPresentationPanel, "fakeSensorTemperature", 2);
    };

    gpii.tests.sensorPresentationPanelTester.testRemoveSensor = function (sensorPresentationPanel) {
        sensorPresentationPanel.applier.change("sensors.fakeSensorPH", null, "DELETE");

        gpii.tests.sensorPresentationPanelTester.verifySensorPresenterRemoval(sensorPresentationPanel, "fakeSensorPH", 1);

        sensorPresentationPanel.applier.change("sensors.fakeSensorTemperature", null, "DELETE");

        gpii.tests.sensorPresentationPanelTester.verifySensorPresenterRemoval(sensorPresentationPanel, "fakeSensorTemperature", 0);
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

        var containerClassKey = sensorPresentationPanel.options.containerClassKey;

        var sensorContainers = sensorPresentationPanel.container.find( ".nexus-nexusSensorPresentationPanel-sensorDisplay");

        jqUnit.assertTrue("Number of sensor containers as expected", sensorContainers.length === sensorOrderSpec.length);

        fluid.each(sensorOrderSpec, function (sensor, idx) {

            jqUnit.assertEquals(sensor.name + " at position " + idx + " of attachedContainers array", sensorPresentationPanel.attachedContainers[idx].sensorName, sensor.name);

            jqUnit.assertTrue("Sensor container at position " + idx + " in DOM ordering has expected class of " + sensor[containerClassKey], $(sensorContainers[idx]).hasClass(sensor[containerClassKey]));

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

    gpii.tests.sensorVisualizationPanelTests();

    gpii.tests.sensorSonificationPanelTests();

}());
