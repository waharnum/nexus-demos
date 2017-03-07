(function () {
    "use strict";

    fluid.defaults("fluid.trackerSynth.zoneController", {
        gradeNames: "fluid.viewComponent",

        model: {
            pointerPosition: {
                left: 0,
                top: 0
            },

            zoneRects: {
                expander: {
                    funcName: "fluid.trackerSynth.zoneController.rectsForZones",
                    args: ["{that}"]
                }
            },

            activeZoneIdx: -1
        },

        modelListeners: {
            pointerPosition: [
                "fluid.trackerSynth.zoneController.updateZonePosition({that})"
            ],

            activeZoneIdx: [
                {
                    "this": "{that}.dom.zones",
                    method: "removeClass",
                    args: ["{that}.options.styles.highlight"]
                },

                {
                    funcName: "fluid.trackerSynth.zoneController.activateZone",
                    args: ["{change}.value", "{that}.dom.zones", "{that}.options.styles"]
                }
            ]
        },

        selectors: {
            zones: ".zone"
        },

        styles: {
            highlight: "highlight"
        }
    });

    fluid.trackerSynth.zoneController.rectForZone = function (zone) {
        zone = $(zone);
        var position = zone.position(),
            height = zone.height(),
            width = zone.width();

        return {
            top: position.top,
            bottom: position.top + height,
            left: position.left,
            right: position.left + width
        };
    };

    fluid.trackerSynth.zoneController.rectsForZones = function (that) {
        var zones = that.locate("zones");
        return fluid.transform(zones, fluid.trackerSynth.zoneController.rectForZone);
    };

    fluid.trackerSynth.zoneController.isInZone = function (zoneRect, pointerPosition) {
        return pointerPosition.left >= zoneRect.left &&
            pointerPosition.left <= zoneRect.right &&
            pointerPosition.top >= zoneRect.top &&
            pointerPosition.top <= zoneRect.bottom;
    };

    fluid.trackerSynth.zoneController.updateZonePosition = function (that) {
        for (var i = 0; i < that.model.zoneRects.length; i++) {
            var zoneRect = that.model.zoneRects[i];
            if (fluid.trackerSynth.zoneController.isInZone(zoneRect, that.model.pointerPosition)) {
                that.applier.change("activeZoneIdx", i);
                return;
            }
        }

        that.applier.change("activeZoneIdx", -1);
    };

    fluid.trackerSynth.zoneController.activateZone = function (zoneIdx, zones, styles) {
        if (zoneIdx < 0) {
            return;
        }

        var zone = zones.eq(zoneIdx);
        zone.addClass(styles.highlight);
    };
}());
