"use strict";

class CircleSlider {
  /**
   * Creates an instance of CircleSlider inside the element with the id `targetId`
   * @param {String} targetId  The id of the element to contain the circle slider.
   * @param {Number} startVal  The starting value for the slider.
   * @param {Number} minVal    The minimum value for the slider.
   * @param {Number} maxVal    The maximum value for the slider.
   * @memberof CircleSlider
   */
  constructor(targetId, startVal, minVal, maxVal) {
    this.outputAngle = startVal;
    this.root = document.getElementById(targetId);

    // validation
    if (!this.root) { 
      console.error("CircleSlider: Didn't find any element with id " + targetId); 
    }
    if (startVal < minVal || startVal > maxVal) {
      console.error("CircleSlider: startVal is outside the bounds of min and max");
    }
    if (minVal > maxVal) {
      console.error("CircleSlider: min is greater than max!");
    }
    if (maxVal < minVal) {
      console.error("CircleSlider: max is less than min!");
    }

    // create the bg and handle elements
    this.bg = this._createBgElem();
    this.hc = this._createHandleContainerElem();
    this.handle = this._createHandleElem();
    
    // append them inside the root element
    this.root.appendChild(this.bg);
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
   * on
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
    const angle = this.getAngle(e);
    this.hc.style.cssText = `transform: rotate(${angle}deg);`;

    this.outputAngle = 360-Math.round(angle);
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

  getAngle(e) {
    const pivot = this._getCenter(this.bg);
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

  _createBgElem() {
    let bg = document.createElement("div");
    bg.className = `cs-bg`;
    bg.style.cssText = "height: 100%; width: 100%; border-radius: 100%;";
    return bg;
  }

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