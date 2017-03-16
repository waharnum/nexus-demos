(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.nexusScienceLabDashboard", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        numberLocale: "en",
        maximumFractionDigits: 2,
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensors",
            receivesChangesFromNexus: true,
            sendsChangesToNexus: false
        },
        strings: {
            noSensorsConnected: "No sensors connected"
        },
        modelListeners: {
            sensors: {
                funcName: "gpii.nexusScienceLabDashboard.updateDashboard",
                args: [
                    "{that}.container",
                    "{that}.options.numberLocale",
                    "{that}.options.maximumFractionDigits",
                    "{that}.options.strings.noSensorsConnected",
                    "{change}.value"
                ]
            }
        }
    });

    // TODO: Add a hidden h1 "Dashboard"
    // TODO: Don't rebuild the content for every update
    // TODO: If a value is present, update it
    // TODO: If a value is not present, add it at the appropriate position
    // TODO: If a value is on the page but not in the latest data, remove it

    gpii.nexusScienceLabDashboard.updateDashboard = function (container, numberLocale, maximumFractionDigits, noSensorsConnectedMessage, sensors) {
        var sensorsArray = fluid.hashToArray(
            sensors,
            "sensor"
        );

        if (sensorsArray.length === 0) {
            container.html(fluid.stringTemplate("<p>%message</p>", {
                message: noSensorsConnectedMessage
            }));
        } else {
            fluid.stableSort(sensorsArray, function (a, b) {
                return a.name.localeCompare(b.name);
            });

            container.empty();

            fluid.each(sensorsArray, function (sensor) {
                container.append(fluid.stringTemplate(
                    "<div><h2>%heading</h2><p class='fl-nexus-science-lab-dashboard-value'>%value</p></div>",
                    {
                        heading: gpii.nexusScienceLabDashboard.buildSensorHeading(sensor),
                        value: sensor.value.toLocaleString(numberLocale, {
                            maximumFractionDigits: maximumFractionDigits
                        })
                    }
                ));
            });
        }
    };

    gpii.nexusScienceLabDashboard.buildSensorHeading = function (sensorData) {
        if (sensorData.units) {
            return fluid.stringTemplate("%sensorName (%units)", {
                sensorName: sensorData.name,
                units: sensorData.units
            });
        } else {
            return sensorData.name;
        }
    };

}());
