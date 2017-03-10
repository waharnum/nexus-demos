(function () {
    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.nexusScienceLabTable", {
        gradeNames: ["gpii.nexusWebSocketBoundComponent", "fluid.viewComponent"],
        members: {
            nexusPeerComponentPath: "scienceLabCollector",
            nexusBoundModelPath: "sensorValues",
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
            sensorValues: {
                funcName: "gpii.nexusScienceLabTable.updateTable",
                args: ["{that}.dom.tableHead", "{that}.dom.tableBody", "{change}.value"]
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

    gpii.nexusScienceLabTable.updateTable = function (tableHead, tableBody, sensorValues) {
        var sensorValuesArray = fluid.hashToArray(
            sensorValues,
            "sensorName",
            function (newElement, oldElement) {
                newElement.sensorValue = oldElement;
            }
        );

        fluid.stableSort(sensorValuesArray, function (a, b) {
            return a.sensorName.localeCompare(b.sensorName);
        });

        tableHead.empty();
        tableBody.empty();

        fluid.each(sensorValuesArray, function (sensor) {
            tableHead.append("<th>" + sensor.sensorName + "</th>");
            tableBody.append("<td>" + sensor.sensorValue + "</td>");
        });
    };

}());
