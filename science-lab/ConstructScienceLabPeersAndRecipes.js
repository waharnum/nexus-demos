"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("gpii-nexus-client");

var nexusHost = "localhost";
var nexusPort = 9081;

fluid.promise.sequence([
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.fakeSensor",
            {
                gradeNames: [ "fluid.modelComponent" ],
                model: {
                    sensorData: { }
                }
            }
        );
    },
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.atlasScientificDriver.phSensor",
            {
                gradeNames: [ "fluid.modelComponent" ],
                model: {
                    sensorData: { }
                }
            }
        );
    },
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.atlasScientificDriver.conductivitySensor",
            {
                gradeNames: [ "fluid.modelComponent" ],
                model: {
                    sensorData: { }
                }
            }
        );
    },
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.scienceLab.collector",
            {
                gradeNames: [ "fluid.modelComponent" ],
                model: {
                    sensors: { }
                }
            }
        );
    },
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.scienceLab.sendFakeSensor",
            {
                gradeNames: [ "gpii.nexus.recipeProduct" ],
                componentPaths: {
                    fakeSensor: null,
                    collector: null
                },
                components: {
                    fakeSensor: "@expand:fluid.componentForPath({recipeProduct}.options.componentPaths.fakeSensor)",
                    collector: "@expand:fluid.componentForPath({recipeProduct}.options.componentPaths.collector)"
                },
                modelRelay: {
                    source: "{fakeSensor}.model.sensorData",
                    target: "{collector}.model.sensors.fakeSensor",
                    forward: {
                        excludeSource: "init"
                    },
                    singleTransform: {
                        type: "fluid.identity"
                    }
                },
                listeners: {
                    "onDestroy.removeFakeSensor": {
                        listener: "{collector}.applier.change",
                        args: [ "sensors.fakeSensor", null, "DELETE" ]
                    }
                }
            }
        );
    },
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.scienceLab.sendPhSensor",
            {
                gradeNames: [ "gpii.nexus.recipeProduct" ],
                componentPaths: {
                    phSensor: null,
                    collector: null
                },
                components: {
                    phSensor: "@expand:fluid.componentForPath({recipeProduct}.options.componentPaths.phSensor)",
                    collector: "@expand:fluid.componentForPath({recipeProduct}.options.componentPaths.collector)"
                },
                modelRelay: {
                    source: "{phSensor}.model.sensorData",
                    target: "{collector}.model.sensors.phSensor",
                    forward: {
                        excludeSource: "init"
                    },
                    singleTransform: {
                        type: "fluid.identity"
                    }
                },
                listeners: {
                    "onDestroy.removePhSensor": {
                        listener: "{collector}.applier.change",
                        args: [ "sensors.phSensor", null, "DELETE" ]
                    }
                }
            }
        );
    },
    function () {
        return gpii.writeNexusDefaults(
            nexusHost,
            nexusPort,
            "gpii.nexus.scienceLab.sendConductivitySensor",
            {
                gradeNames: [ "gpii.nexus.recipeProduct" ],
                componentPaths: {
                    conductivitySensor: null,
                    collector: null
                },
                components: {
                    conductivitySensor: "@expand:fluid.componentForPath({recipeProduct}.options.componentPaths.conductivitySensor)",
                    collector: "@expand:fluid.componentForPath({recipeProduct}.options.componentPaths.collector)"
                },
                modelRelay: {
                    source: "{conductivitySensor}.model.sensorData",
                    target: "{collector}.model.sensors.conductivitySensor",
                    forward: {
                        excludeSource: "init"
                    },
                    singleTransform: {
                        type: "fluid.identity"
                    }
                },
                listeners: {
                    "onDestroy.removeConductivitySensor": {
                        listener: "{collector}.applier.change",
                        args: [ "sensors.conductivitySensor", null, "DELETE" ]
                    }
                }
            }
        );
    },
    function () {
        return gpii.constructNexusPeer(nexusHost, nexusPort, "scienceLabCollector", {
            type: "gpii.nexus.scienceLab.collector"
        });
    },
    function () {
        return gpii.addNexusRecipe(nexusHost, nexusPort, "sendFakeSensor", {
            reactants: {
                fakeSensor: {
                    match: {
                        type: "gradeMatcher",
                        gradeName: "gpii.nexus.fakeSensor"
                    }
                },
                collector: {
                    match: {
                        type: "gradeMatcher",
                        gradeName: "gpii.nexus.scienceLab.collector"
                    }
                }
            },
            product: {
                path: "sendFakeSensor",
                options: {
                    type: "gpii.nexus.scienceLab.sendFakeSensor"
                }
            }
        });
    },
    function () {
        return gpii.addNexusRecipe(nexusHost, nexusPort, "sendPhSensor", {
            reactants: {
                phSensor: {
                    match: {
                        type: "gradeMatcher",
                        gradeName: "gpii.nexus.atlasScientificDriver.phSensor"
                    }
                },
                collector: {
                    match: {
                        type: "gradeMatcher",
                        gradeName: "gpii.nexus.scienceLab.collector"
                    }
                }
            },
            product: {
                path: "sendPhSensor",
                options: {
                    type: "gpii.nexus.scienceLab.sendPhSensor"
                }
            }
        });
    },
    function () {
        return gpii.addNexusRecipe(nexusHost, nexusPort, "sendConductivitySensor", {
            reactants: {
                conductivitySensor: {
                    match: {
                        type: "gradeMatcher",
                        gradeName: "gpii.nexus.atlasScientificDriver.conductivitySensor"
                    }
                },
                collector: {
                    match: {
                        type: "gradeMatcher",
                        gradeName: "gpii.nexus.scienceLab.collector"
                    }
                }
            },
            product: {
                path: "sendConductivitySensor",
                options: {
                    type: "gpii.nexus.scienceLab.sendConductivitySensor"
                }
            }
        });
    }
]);
