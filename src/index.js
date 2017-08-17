"use strict";

class CircleSlider {
  /**
   * Creates an instance of CircleSlider inside the element with the id `targetId`
   * @param {String} targetId         The id of the element to contain the circle slider.
   * @param {Number} [snapMultiplier] Makes the handle snap to every multiple of this number.
   * @memberof CircleSlider
   */
  constructor(targetId, snapMultiplier) {
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
    }

    // active is true when user is holding down handle
    this.active = false;
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
  on(name, callback) {
    const eventName = this.root.id + "-" + name;
    this.root.addEventListener(eventName, callback);
  }

  /**
   * Returns the angle/value of the slider.
   * 
   * @returns The current value
   * @memberof CircleSlider
   */
  getAngle() {
    return this.outputAngle;
  }

  /**
   * Manually sets the angle/value of the slider.
   * 
   * @param {Number} angle  The new value for the slider
   * @memberof CircleSlider
   */
  setAngle(angle) {
    const rawAngle = 360 - angle;
    this._moveHandle(rawAngle);
  }

  // "private" methods

  _fireEvent(name, data) {
    const eventName = this.root.id + "-" + name;
    const event = new CustomEvent(eventName, { detail: data });
    this.root.dispatchEvent(event);
  }

  _addEventListeners(startEvent, moveEvent, endEvent) {
    // user presses handle
    this.handle.addEventListener(startEvent, (e) => {
      // prevent text selection
      e.preventDefault();

      if (!this.active) {
        this.active = true;

        // user moves handle
        document.addEventListener(moveEvent, this._mouseMoveHandler, false);

        // user lets go
        document.addEventListener(endEvent, () => {
          this.active = false;
          document.removeEventListener(moveEvent, this._mouseMoveHandler, false);
          this._fireEvent(this.events.sliderUp, this.outputAngle);
        })
      }
    })
  }

  _mouseMoveHandler(e) {
    e.preventDefault();
    this._moveHandle(this._getRawAngle(e));
  }

  _moveHandle(rawAngle) {
    // snap handle to multiples of snapMultiplier
    if (this.snapMultiplier) {
      const sm = this.snapMultiplier;
      const delta = Math.abs(rawAngle - (Math.round(rawAngle / sm) * sm));
      if (delta <= 5) {
        rawAngle = Math.round(rawAngle / sm) * sm;
      }
    }

    // move the handle visually
    this.hc.style.cssText = `transform: rotate(${rawAngle}deg);`;

    // format angle that gets exposed
    let outputAngle = 360 - Math.round(rawAngle);
    if (outputAngle === 360) {
      outputAngle = 0;
    }
    this.outputAngle = outputAngle; 

    this._fireEvent(this.events.sliderMove, this.outputAngle);
  }

  _getCenter(elem) {
    const rect = elem.getBoundingClientRect();
    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2),
    };
  }

  _radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  _getRawAngle(e) {
    const pivot = this._getCenter(this.root);
    const mouse = {
      x: e.pageX,
      y: e.pageY,
    }
    const offset = -90;
    let angle = this._radToDeg(Math.atan2(mouse.x - pivot.x, -(mouse.y - pivot.y))) + offset;
    if (angle < 0) angle += 360;
    return angle;
  }

  // Uninteresting methods

  _createHandleContainerElem() {
    let hc = document.createElement("div");
    hc.className = "cs-handle-container";
    return hc;
  }

  _createHandleElem() {
    let h = document.createElement("div");
    h.className = "cs-handle";
    return h;
  }
}

module.exports = CircleSlider;