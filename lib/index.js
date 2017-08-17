"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircleSlider = function () {
  /**
   * Creates an instance of CircleSlider inside the element with the id `targetId`
   * @param {String} targetId         The id of the element to contain the circle slider.
   * @param {Number} [snapMultiplier] Makes the handle snap to every multiple of this number.
   * @memberof CircleSlider
   */
  function CircleSlider(targetId, snapMultiplier) {
    _classCallCheck(this, CircleSlider);

    this.root = document.getElementById(targetId);
    this.outputAngle = 0;
    this.snapMultiplier = snapMultiplier;

    // validation
    if (!this.root) {
      console.error("CircleSlider: Didn't find any element with id " + targetId);
    }

    // create the child elements and append them
    this.hc = this._createHandleContainerElem();
    this.handle = this._createHandleElem();
    this.hc.appendChild(this.handle);
    this.root.appendChild(this.hc);

    // just to keep track of all event names
    this.events = {
      sliderMove: "sliderMove",
      sliderUp: "sliderUp"

      // active is true when user is holding down handle
    };this.active = false;
    // mouse events
    this._addEventListeners("mousedown", "mousemove", "mouseup");
    // touch events
    this._addEventListeners("touchstart", "touchmove", "touchend");

    // bind methods
    this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
  }

  // public methods

  /**
   * Use this function to call a callback function to react to
   * synthetic events from this class.
   * 
   * @param {String}    The name of the event to listen to 
   * @param {Function}  The callback function for the event 
   * @memberof CircleSlider
   */


  _createClass(CircleSlider, [{
    key: "on",
    value: function on(name, callback) {
      var eventName = this.root.id + "-" + name;
      this.root.addEventListener(eventName, callback);
    }

    /**
     * Returns the angle/value of the slider.
     * 
     * @returns The current value
     * @memberof CircleSlider
     */

  }, {
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
      var eventName = this.root.id + "-" + name;
      var event = new CustomEvent(eventName, { detail: data });
      this.root.dispatchEvent(event);
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners(startEvent, moveEvent, endEvent) {
      var _this = this;

      // user presses handle
      this.handle.addEventListener(startEvent, function (e) {
        // prevent text selection
        e.preventDefault();

        if (!_this.active) {
          _this.active = true;

          // user moves handle
          document.addEventListener(moveEvent, _this._mouseMoveHandler, false);

          // user lets go
          document.addEventListener(endEvent, function () {
            _this.active = false;
            document.removeEventListener(moveEvent, _this._mouseMoveHandler, false);
            _this._fireEvent(_this.events.sliderUp, _this.outputAngle);
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
      // snap handle to multiples of snapMultiplier
      if (this.snapMultiplier) {
        var sm = this.snapMultiplier;
        var delta = Math.abs(rawAngle - Math.round(rawAngle / sm) * sm);
        if (delta <= 5) {
          rawAngle = Math.round(rawAngle / sm) * sm;
        }
      }

      // move the handle visually
      this.hc.style.cssText = "transform: rotate(" + rawAngle + "deg);";

      // format angle that gets exposed
      var outputAngle = 360 - Math.round(rawAngle);
      if (outputAngle === 360) {
        outputAngle = 0;
      }
      this.outputAngle = outputAngle;

      this._fireEvent(this.events.sliderMove, this.outputAngle);
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
  }, {
    key: "_getRawAngle",
    value: function _getRawAngle(e) {
      var pivot = this._getCenter(this.root);
      var mouse = {
        x: e.pageX,
        y: e.pageY
      };
      var offset = -90;
      var angle = this._radToDeg(Math.atan2(mouse.x - pivot.x, -(mouse.y - pivot.y))) + offset;
      if (angle < 0) angle += 360;
      return angle;
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
}();

module.exports = CircleSlider;