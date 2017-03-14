(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.nexusScienceLabTable", {
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
                funcName: "gpii.nexusScienceLabTable.updateTable",
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

    // TODO: Don't rebuild the table for every update:
    //       If a value is in the table, update it
    //       If a value is not in the table, add it at the appropriate column
    //       If a column is in the table but not in the data, remove it

    gpii.nexusScienceLabTable.updateTable = function (container, numberLocale, maximumFractionDigits, noSensorsConnectedMessage, sensors) {
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

            container.html("<table><thead><tr class='flc-nexus-science-lab-table-head'></tr></thead><tbody><tr class='flc-nexus-science-lab-table-body'></tr></tbody></table>");
            var tableHead = container.find(".flc-nexus-science-lab-table-head");
            var tableBody = container.find(".flc-nexus-science-lab-table-body");

            fluid.each(sensorsArray, function (sensor) {
                tableHead.append(fluid.stringTemplate("<th>%sensorName</th>", {
                    sensorName: sensor.name
                }));
                tableBody.append(fluid.stringTemplate("<td>%sensorValue</td>", {
                    sensorValue: sensor.value.toLocaleString(numberLocale, {
                        maximumFractionDigits: maximumFractionDigits
                    })
                }));
            });
        }
    };

}());
