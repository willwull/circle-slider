(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var CircleSlider = require("../lib/index.js");

var cs = new CircleSlider("slider", 45);
var targetDiv = document.getElementById("angle");

cs.on("sliderMove", function (angle) {
  targetDiv.innerHTML = "&nbsp;" + angle + "&deg;";
});

cs.on("sliderUp", function (angle) {
  console.log("sliderUp " + angle);
});

},{"../lib/index.js":2}],2:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var EventEmitter = require("events").EventEmitter;

var CircleSlider = function (_EventEmitter) {
  _inherits(CircleSlider, _EventEmitter);

  /**
   * Creates an instance of CircleSlider inside the element with the id `targetId`
   * @param {String} targetId         The id of the element to contain the circle slider.
   * @param {Number} [snapMultiplier] Makes the handle snap to every multiple of this number.
   * @memberof CircleSlider
   */
  function CircleSlider(targetId, snapMultiplier) {
    _classCallCheck(this, CircleSlider);

    var _this = _possibleConstructorReturn(this, (CircleSlider.__proto__ || Object.getPrototypeOf(CircleSlider)).call(this));

    _this.root = document.getElementById(targetId);
    _this.outputAngle = 0;
    _this.snapMultiplier = snapMultiplier;

    // validation
    if (!_this.root) {
      console.error("CircleSlider: Didn't find any element with id " + targetId);
    }

    // create the child elements and append them
    _this.hc = CircleSlider._createHandleContainerElem();
    _this.handle = CircleSlider._createHandleElem();
    _this.hc.appendChild(_this.handle);
    _this.root.appendChild(_this.hc);

    // just to keep track of all event names
    _this.events = {
      sliderMove: "sliderMove",
      sliderUp: "sliderUp"
    };

    // active is true when user is holding down handle
    _this.active = false;
    // mouse events
    _this._addEventListeners("mousedown", "mousemove", "mouseup");
    // touch events
    _this._addEventListeners("touchstart", "touchmove", "touchend");

    // bind methods
    _this._mouseMoveHandler = _this._mouseMoveHandler.bind(_this);
    return _this;
  }

  // public methods

  /**
   * Use this function to call a callback function to react to
   * synthetic events from this class.
   *
   * @param {String} name       The name of the event to listen to
   * @param {Function} callback The callback function for the event
   * @memberof CircleSlider
   */
  /* on(name, callback) {
    const eventName = `${this.root.id}-${name}`;
    this.root.addEventListener(eventName, callback);
  } */

  /**
   * Returns the angle/value of the slider.
   *
   * @returns The current value
   * @memberof CircleSlider
   */

  _createClass(CircleSlider, [{
    key: "getAngle",
    value: function getAngle() {
      return this.outputAngle;
    }

    /**
     * Manually sets the angle/value of the slider.
     *
     * @param {Number} angle  The new value for the slider
     * @memberof CircleSlider
     */

  }, {
    key: "setAngle",
    value: function setAngle(angle) {
      var rawAngle = 360 - angle;
      this._moveHandle(rawAngle);
    }

    // "private" methods

  }, {
    key: "_fireEvent",
    value: function _fireEvent(name, data) {
      // const eventName = `${this.root.id}-${name}`;
      // const event = new CustomEvent(eventName, { detail: data });
      // this.root.dispatchEvent(event);
      this.emit(name, data);
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners(startEvent, moveEvent, endEvent) {
      var _this2 = this;

      // user presses handle
      this.handle.addEventListener(startEvent, function (e) {
        // prevent text selection
        e.preventDefault();

        if (!_this2.active) {
          _this2.active = true;

          // user moves handle
          document.addEventListener(moveEvent, _this2._mouseMoveHandler, false);

          // user lets go
          document.addEventListener(endEvent, function () {
            _this2.active = false;
            document.removeEventListener(moveEvent, _this2._mouseMoveHandler, false);
            _this2._fireEvent(_this2.events.sliderUp, _this2.outputAngle);
          });
        }
      });
    }
  }, {
    key: "_mouseMoveHandler",
    value: function _mouseMoveHandler(e) {
      e.preventDefault();
      this._moveHandle(this._getRawAngle(e));
    }
  }, {
    key: "_moveHandle",
    value: function _moveHandle(rawAngle) {
      var angle = rawAngle;
      // snap handle to multiples of snapMultiplier
      if (this.snapMultiplier) {
        var sm = this.snapMultiplier;
        var delta = Math.abs(angle - Math.round(angle / sm) * sm);
        if (delta <= 5) {
          angle = Math.round(angle / sm) * sm;
        }
      }

      // move the handle visually
      this.hc.style.cssText = "transform: rotate(" + angle + "deg);";

      // format angle that gets exposed
      var outputAngle = 360 - Math.round(angle);
      if (outputAngle === 360) {
        outputAngle = 0;
      }
      this.outputAngle = outputAngle;

      this._fireEvent(this.events.sliderMove, this.outputAngle);
    }
  }, {
    key: "_getRawAngle",
    value: function _getRawAngle(e) {
      var pivot = CircleSlider._getCenter(this.root);
      var mouse = {
        x: e.pageX,
        y: e.pageY
      };
      var offset = -90;
      var angle = CircleSlider._radToDeg(Math.atan2(mouse.x - pivot.x, -(mouse.y - pivot.y))) + offset;
      if (angle < 0) angle += 360;
      return angle;
    }
  }], [{
    key: "_getCenter",
    value: function _getCenter(elem) {
      var rect = elem.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, {
    key: "_radToDeg",
    value: function _radToDeg(rad) {
      return rad * (180 / Math.PI);
    }

    // Uninteresting methods

  }, {
    key: "_createHandleContainerElem",
    value: function _createHandleContainerElem() {
      var hc = document.createElement("div");
      hc.className = "cs-handle-container";
      return hc;
    }
  }, {
    key: "_createHandleElem",
    value: function _createHandleElem() {
      var h = document.createElement("div");
      h.className = "cs-handle";
      return h;
    }
  }]);

  return CircleSlider;
}(EventEmitter);

module.exports = CircleSlider;

},{"events":3}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1]);
