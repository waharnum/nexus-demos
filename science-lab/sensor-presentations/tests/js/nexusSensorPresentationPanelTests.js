/* global fluid, floe, jqUnit */

(function () {

    "use strict";

    jqUnit.test("Test sensor visualizer creation", function () {
        jqUnit.expect(0);

        window.nexusSensorVisualizationPanel = gpii.nexusSensorVisualizationPanelMock(".nexus-nexusSensorVisualizationPanel", {
            members: {
                nexusHost: window.location.hostname
            }
        });

        var fakeSensorPH = {
            "name": "Fake pH Sensor",
            "value": 7,
            "rangeMax": 14,
            "rangeMin": 0
        };

        window.nexusSensorVisualizationPanel.applier.change("sensors.fakeSensorPH",
        fakeSensorPH);

    });

}());
