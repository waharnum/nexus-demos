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

    gpii.nexusScienceLabDashboard.updateDashboard = function (container, numberLocale, maximumFractionDigits, noSensorsConnectedMessage, sensors) {

        var sensorsArray = fluid.hashToArray(sensors, "sensor");

        if (sensorsArray.length === 0) {
            container.html(fluid.stringTemplate(
                "<p class='flc-nexus-science-lab-dashboard-message'>%message</p>",
                {
                    message: noSensorsConnectedMessage
                }
            ));
        } else {
            $(".flc-nexus-science-lab-dashboard-message").remove();

            fluid.stableSort(sensorsArray, function (a, b) {
                return a.name.localeCompare(b.name);
            });

            gpii.nexusScienceLabDashboard.updateDashboardValues(
                container,
                numberLocale,
                maximumFractionDigits,
                sensorsArray
            );
        }
    };

    gpii.nexusScienceLabDashboard.updateDashboardValues = function (container, numberLocale, maximumFractionDigits, sortedSensors) {

        var sensorsArrayIndex = 0;

        container.find("div").each(function (index, sensorDivElem) {
            if (sensorsArrayIndex < sortedSensors.length) {
                // We have incoming sensor data yet to process

                var sensorOnPage = $($(sensorDivElem).find("h2")).text();

                // Insert any new sensors
                while (sensorOnPage.localeCompare(gpii.nexusScienceLabDashboard.buildSensorHeading(sortedSensors[sensorsArrayIndex])) === 1) {
                    $(sensorDivElem).before(gpii.nexusScienceLabDashboard.buildSensorDiv(
                        sortedSensors[sensorsArrayIndex],
                        numberLocale,
                        maximumFractionDigits
                    ));
                    ++sensorsArrayIndex;
                }

                switch (sensorOnPage.localeCompare(gpii.nexusScienceLabDashboard.buildSensorHeading(sortedSensors[sensorsArrayIndex]))) {
                    case 0:
                        // Existing value, update it
                        var newValue = gpii.nexusScienceLabDashboard.buildSensorValue(
                            sortedSensors[sensorsArrayIndex],
                            numberLocale,
                            maximumFractionDigits
                        );
                        $($(sensorDivElem).find("p")).text(newValue);
                        ++sensorsArrayIndex;
                        break;
                    case -1:
                        // Outdated sensor, remove it
                        $(sensorDivElem).remove();
                        break;
                }
            } else {
                // We have reached the end of the incoming sensor data,
                // remove any remaining outdated values from the page
                $(sensorDivElem).remove();
            }
        });

        // Add any remaining new sensors from the incoming data
        while (sensorsArrayIndex < sortedSensors.length) {
            container.append(gpii.nexusScienceLabDashboard.buildSensorDiv(
                sortedSensors[sensorsArrayIndex],
                numberLocale,
                maximumFractionDigits
            ));
            ++sensorsArrayIndex;
        }
    };

    gpii.nexusScienceLabDashboard.buildSensorDiv = function (sensorData, numberLocale, maximumFractionDigits) {
        return fluid.stringTemplate(
            "<div><h2>%heading</h2><p class='fl-nexus-science-lab-dashboard-value'>%value</p></div>",
            {
                heading: gpii.nexusScienceLabDashboard.buildSensorHeading(sensorData),
                value: gpii.nexusScienceLabDashboard.buildSensorValue(
                    sensorData,
                    numberLocale,
                    maximumFractionDigits
                )
            }
        );
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

    gpii.nexusScienceLabDashboard.buildSensorValue = function (sensorData, numberLocale, maximumFractionDigits) {
        return sensorData.value.toLocaleString(numberLocale, {
            maximumFractionDigits: maximumFractionDigits
        });
    };

}());
