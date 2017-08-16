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

    this.mouseDown = false;
    this.handle.addEventListener("mousedown", (e) => {
      // prevent text selection
      e.preventDefault();
      
      if (!this.mouseDown) {
        this.mouseDown = true;
        // add eventListener on document instead of handler so that
        // dragging keeps working when the mouse is outside the root element
        document.addEventListener("mousemove", this._mouseMoveHandler, false);
        // add to document for the same reason as above, the user can
        // release the mouse outside the root element
        document.addEventListener("mouseup", () => {
          this.mouseDown = false;
          document.removeEventListener("mousemove", this._mouseMoveHandler, false);
        })
      }
    })

    // bind functions
    this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
  }

  _mouseMoveHandler(e) {
    e.preventDefault();
    const angle = this.getAngle(e);
    this.hc.style.cssText = `transform: rotate(${angle}deg);`;
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