const EventEmitter = require("eventemitter3");

class CircleSlider extends EventEmitter {
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
  constructor(targetId, options) {
    super();
    // allow both "id" or "#id"
    this.root = document.getElementById(targetId) || document.getElementById(targetId.slice(1));
    this.outputAngle = 0;
    this.clockwise = options.clockwise; // affects _formatOutputAngle
    this.snapMultiplier = options.snap;
    this.startOffset = 0; // "right" is default
    this.dragOffset = 0;
    console.log(options);
    switch (options.startPos) {
      case "top":
        this.startOffset = -90;
        this.dragOffset = -90;
        break;
      case "left":
        this.startOffset = -180;
        this.dragOffset = -90;
        break;
      case "bottom":
        this.startOffset = -270;
        this.dragOffset = -90;
        break;
      default:
        break;
    }

    // validation
    if (!this.root) {
      console.error(`CircleSlider: Didn't find any element with id ${targetId}`);
    }

    // create the child elements and append them
    this.hc = CircleSlider._createHandleContainerElem();
    this.handle = CircleSlider._createHandleElem();
    this.hc.appendChild(this.handle);
    this.root.appendChild(this.hc);

    // put the handle at the correct position
    this.hc.style.cssText = `transform: rotate(${this.startOffset}deg);`;

    // just to keep track of all event names
    this.events = {
      sliderMove: "sliderMove",
      sliderUp: "sliderUp",
    };

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
    const rawAngle = this._formatOutputAngle(angle);
    this._moveHandle(rawAngle);
  }

  // "private" methods

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
          this.emit(this.events.sliderUp, this.outputAngle);
        });
      }
    });
  }

  _mouseMoveHandler(e) {
    e.preventDefault();
    this._moveHandle(this._getRawAngle(e));
  }

  _moveHandle(rawAngle) {
    let angle = rawAngle;
    // snap handle to multiples of snapMultiplier
    if (this.snapMultiplier) {
      const sm = this.snapMultiplier;
      const delta = Math.abs(angle - (Math.round(angle / sm) * sm));
      if (delta <= 5) {
        angle = Math.round(angle / sm) * sm;
      }
    }

    // move the handle visually
    this.hc.style.cssText = `transform: rotate(${angle}deg);`;

    this.outputAngle = this._formatOutputAngle(angle);

    this.emit(this.events.sliderMove, this.outputAngle);
  }

  _formatOutputAngle(angle) {
    const outputAngle = this.clockwise === true ?
      ((360 - Math.round(angle)) + this.startOffset) % 360 :
      ((360 + Math.round(angle)) + this.startOffset) % 360;
    return outputAngle;
  }

  _getRawAngle(e) {
    const pivot = CircleSlider._getCenter(this.root);
    const mouse = {
      x: e.pageX,
      y: e.pageY,
    };

    const angle = (CircleSlider._radToDeg(Math.atan2(mouse.x - pivot.x, -(mouse.y - pivot.y)))
      + this.dragOffset) % 360;
    return angle;
  }

  static _getCenter(elem) {
    const rect = elem.getBoundingClientRect();
    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2),
    };
  }

  static _radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  // Uninteresting methods

  static _createHandleContainerElem() {
    const hc = document.createElement("div");
    hc.className = "cs-handle-container";
    return hc;
  }

  static _createHandleElem() {
    const h = document.createElement("div");
    h.className = "cs-handle";
    return h;
  }
}

module.exports = CircleSlider;
