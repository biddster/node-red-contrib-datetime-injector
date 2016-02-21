/**
 The MIT License (MIT)

 Copyright (c) 2016 @biddster

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

module.exports = function (RED) {

    var moment = require('moment');

    'use strict';
    RED.nodes.registerType('datetime-injector', function (config) {
        RED.nodes.createNode(this, config);
        var node = this, interval;

        // E.g. 2016-02-12T21:56
        var fireDate = moment(config.datetime, 'YYYY-MM-DDTHH:mm');

        node.on('input', function (msg) {
            try {
                var now = moment();
                if (now.isSame(fireDate, 'minute')) {
                    node.send({
                        topic: config.topic,
                        payload: config.payload
                    });
                    shutdown();
                    node.status({fill: 'green', shape: 'dot', text: 'Injection completed'});
                } else {
                    node.status({fill: 'green', shape: 'ring', text: now.to(fireDate)});
                }
            } catch (error) {
                node.log(error.stack);
                node.error(error, msg);
                node.status({fill: 'red', shape: 'dot', text: error.message});
            }
        });

        var now = moment();
        console.log('Now: ' + now.toISOString());
        console.log('Fire date: ' + fireDate.toISOString());
        if (fireDate.isBefore(now)) {
            node.status({fill: 'red', shape: 'dot', text: 'Date is before now!'});
        } else {
            node.status({fill: 'green', shape: 'ring', text: now.to(fireDate)});
            interval = setInterval(function () {
                node.emit('input', {});
            }, 60000);
            node.on('close', shutdown);
        }

        function shutdown() {
            if (interval) {
                clearInterval(interval);
            }
        }
    });
};