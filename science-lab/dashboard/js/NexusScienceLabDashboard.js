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

    // TODO: Change from a table to headings and paragraphs for values
    // TODO: Include a hidden h1 "Dashboard"
    // TODO: Use h2s for the sensor names
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

            container.html("<table><thead><tr class='flc-nexus-science-lab-dashboard-head'></tr></thead><tbody><tr class='flc-nexus-science-lab-dashboard-body'></tr></tbody></table>");
            var dashboardHead = container.find(".flc-nexus-science-lab-dashboard-head");
            var dashboardBody = container.find(".flc-nexus-science-lab-dashboard-body");

            fluid.each(sensorsArray, function (sensor) {
                dashboardHead.append(gpii.nexusScienceLabDashboard.buildDashboardHeading(sensor));
                dashboardBody.append(fluid.stringTemplate("<td>%sensorValue</td>", {
                    sensorValue: sensor.value.toLocaleString(numberLocale, {
                        maximumFractionDigits: maximumFractionDigits
                    })
                }));
            });
        }
    };

    gpii.nexusScienceLabDashboard.buildDashboardHeading = function (sensorData) {
        if (sensorData.units) {
            return fluid.stringTemplate("<th>%sensorName (%units)</th>", {
                sensorName: sensorData.name,
                units: sensorData.units
            });
        } else {
            return fluid.stringTemplate("<th>%sensorName</th>", {
                sensorName: sensorData.name
            });
        }
    };

}());
