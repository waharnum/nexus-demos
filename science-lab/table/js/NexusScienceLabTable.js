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
        selectors: {
            table: ".flc-nexus-science-lab-table",
            tableHead: ".flc-nexus-science-lab-table-head",
            tableBody: ".flc-nexus-science-lab-table-body"
        },
        listeners: {
            "onCreate.buildTable": {
                listener: "gpii.nexusScienceLabTable.buildTable",
                args: ["{that}.dom.table"]
            }
        },
        modelListeners: {
            sensors: {
                funcName: "gpii.nexusScienceLabTable.updateTable",
                args: [
                    "{that}.dom.tableHead",
                    "{that}.dom.tableBody",
                    "{that}.options.numberLocale",
                    "{that}.options.maximumFractionDigits",
                    "{change}.value"
                ]
            }
        }
    });

    gpii.nexusScienceLabTable.buildTable = function (tableElem) {
        tableElem.html("<thead><tr class='flc-nexus-science-lab-table-head'></tr></thead><tbody><tr class='flc-nexus-science-lab-table-body'></tr></tbody>");
    };

    // TODO: Don't empty and rebuild the table for every update:
    //       If a value is in the table, update it
    //       If a value is not in the table, add it at the appropriate column
    //       If a column is in the table but not in the data, remove it

    gpii.nexusScienceLabTable.updateTable = function (tableHead, tableBody, numberLocale, maximumFractionDigits, sensors) {
        var sensorsArray = fluid.hashToArray(
            sensors,
            "sensor"
        );

        fluid.stableSort(sensorsArray, function (a, b) {
            return a.name.localeCompare(b.name);
        });

        tableHead.empty();
        tableBody.empty();

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
    };

}());
