(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var CircleSlider = require("../lib/index.js");

var options = {
  snap: 90,
  clockwise: true
};
var cs = new CircleSlider("#slider", options);
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

var EventEmitter = require("eventemitter3");

var CircleSlider = function (_EventEmitter) {
  _inherits(CircleSlider, _EventEmitter);

  /**
   * Creates an instance of CircleSlider inside the element with the id `targetId`
   * @param {String} targetId              The id of the element to contain the circle slider.
   * @param {Object} [options]             An object containing options for the slider.
   * @param {Number} [options.snap]        Makes the handle snap to every multiple of this number.
   * @param {Boolean} [options.clockwise]  True to make clockwise the positive direction.
   * @param {"top"|"bottom"|"left"|"right"} [options.startPos]
   *    Which side the handle should start at.
   * @memberof CircleSlider
   */
  function CircleSlider(targetId, options) {
    _classCallCheck(this, CircleSlider);

    // allow both "id" or "#id"
    var _this = _possibleConstructorReturn(this, (CircleSlider.__proto__ || Object.getPrototypeOf(CircleSlider)).call(this));

    _this.root = document.getElementById(targetId) || document.getElementById(targetId.slice(1));
    _this.outputAngle = 0;
    _this.direction = options.dir;
    _this.clockwise = options.clockwise;
    _this.snapMultiplier = options.snap;

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
            _this2.emit(_this2.events.sliderUp, _this2.outputAngle);
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

      this.outputAngle = CircleSlider._formatOutputAngle(angle);

      this.emit(this.events.sliderMove, this.outputAngle);
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
    key: "_formatOutputAngle",
    value: function _formatOutputAngle(angle) {
      var outputAngle = 360 - Math.round(angle);
      if (outputAngle === 360) {
        outputAngle = 0;
      }
      return outputAngle;
    }
  }, {
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

},{"eventemitter3":3}],3:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}]},{},[1]);
