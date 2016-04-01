"use strict";

document.registerElement("nexus-square", {
    prototype: Object.create(HTMLElement.prototype, {
        createdCallback: {
            value: function () {
                var astericsA = 0;
                var astericsB = 0;

                var websocket = new WebSocket("ws://localhost:9081/bindModel/asterics/inputs");
                websocket.onmessage = function (evt) {
                    var inputs = JSON.parse(evt.data);
                    astericsA = inputs.a;
                    astericsB = inputs.b;
                };

                new p5(function (p) { // jshint ignore:line
                    p.setup = function () {
                        p.createCanvas(720, 720);
                        p.colorMode(p.RGB, 100);
                        p.rectMode(p.CENTER);
                        p.noStroke();
                    };

                    p.draw = function () {
                        var xPos = p.constrain(p.width/2 + astericsA, 0, p.width);
                        var size = p.constrain(p.width/2 + astericsB/2, 10, p.width-10);
                        p.background(20);
                        p.fill(80);
                        p.rect(xPos, p.height/2, size, size);
                    };
                }, this);
            }
        }
    })
});
