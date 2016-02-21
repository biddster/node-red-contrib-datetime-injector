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

"use strict";
var assert = require('chai').assert;
var _ = require('lodash');
var moment = require('moment');

function loadNode(config, mod) {
    var _events = [], _status = undefined, _error = undefined;
    var RED = {
        nodes: {
            registerType: function (nodeName, nodeConfigFunc) {
                this.nodeConfigFunc = nodeConfigFunc;
            },
            createNode: function () {
            }
        },
        on: function (event, eventFunc) {
            _events[event] = eventFunc;
        },
        emit: function (event, data) {
            _events[event](data);
        },
        error: function (error) {
            if (error) _error = error;
            return _error;
        },
        status: function (status) {
            if (status) _status = status;
            return _status;
        },
        log: function () {
            console.log.apply(this, arguments);
        }
    };
    mod(RED);
    RED.nodes.nodeConfigFunc.call(RED, config);
    return RED;
}


var dateTimeInjector = require('../index.js');


describe('datetime-injector', function () {
    it('should do something', function (done) {
        var nextMinute = moment().add(1, 'minute');

        var node = loadNode({
            datetime: nextMinute.format('YYYY-MM-DDTHH:mm'),
            topic: 'a topic',
            payload: 'a payload'
        }, dateTimeInjector);

        node.send = function (msg) {
            assert(msg);
            done();
        };
    });
});
