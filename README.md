# circle-slider
A slider, except it's round.
Pretty good for selecting angles and stuff.

[Demo here.](https://willwull.github.io/circle-slider/)

# Install
```
$ npm i circle-slider
```

## Usage
Basic usage:

HTML:
``` html
<div id="whatever"></div>
```

JS:
``` js
// Import the module at the top of your file
const CircleSlider = require("circle-slider");

// or ES6 style
import CircleSlider from "circle-slider";

// The id of your target element as the first arg
const cs = new CircleSlider("whatever");
```

All you have to do on the HTML side is to create a div with some id, which is the first parameter in the constructor of CircleSlider.

All you need is to create a div, the elements for the handle (and its container) will be created for you.

You can put anything you want inside the div, e.g. a div which displays the current angle (see the demo).

### Options
The constructor takes an optional second parameter which looks like this:
``` js
{
  // e.g. snap to every 45 degrees
  snap: Number,

  // positive direction
  clockwise: Boolean,

  // which position 0 degrees is
  startPos: "top"|"bottom"|"left"|"right",
}
```
I'll emphasize that `startPos` changes where 0 degrees is, so if you instead want, for example, 0 to be at the top, but want the slider to start at 90 degrees, you should call `setAngle(90)` (see below) after creating the slider.

Example usage:

``` js
const options = {
  snap: 45,
  clockwise: false,
  startPos: "top",
};
const cs = new CircleSlider("id", options);
```

You can also write the first parameter with a #:
``` js
new CircleSlider("#id");
```
With or without #, there is no difference in functionality, so choose which one you prefer.

## Methods
Here is the stuff you can do with CircleSlider:

``` js
// get the current angle value
cs.getAngle();

// set the angle manually
cs.setAngle(45);

// fires every time the slider is moved
// the emitted event will give you the angle
cs.on("sliderMove", (angle) => {
    someDiv.textContent = angle;
})

// fires every time the handle stops moving
// can be useful to avoid heavy operations every time the
// handle moves
cs.on("sliderUp", (angle) => {
    someDiv.textContent = angle;
})
```

Note that the `sliderMove` event gets triggered when using `setAngle`.

Since `CircleSlider` extends `eventemitter3`, you can also use functions like `once` instead of `on`.

Further reading [here](https://nodejs.org/api/events.html#events_class_eventemitter) (`eventemitter3` uses the same API as node `events`).

## Styling
I leave most styling up to you! However, there are some CSS rules that you must use in order for the handle two rotate properly and stuff. Here are some good defaults to get started with:

``` css
#slider {
  /*
    position: relative is needed for the handle to be
    positioned correctly, and border-radius: 100% just
    makes the div round.
  */
  position: relative;
  border-radius: 100%;

  /* Other than the above two, go wild! */
  height: 300px;
  width: 300px;
  background: linear-gradient(90deg, #FF9A9E, #FAD0C4);
}

/*
  Probably best to paste this exactly as is.
  These CSS rules make sure that the handle rotates
  properly, so don't change anything here.
*/
.cs-handle-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
}

/* Also paste as is */
.cs-handle {
  position: absolute;
  transform: translateY(-50%);
}

/* the appearance of the handle, feel free to change! */
#slider .cs-handle {
  height: 30px;
  width: 30px;
  /*
    Change 'right' to change the offset from the edge.
    E.g right: 0 puts the handle just next to the edge
    of #slider, on the inside
  */
  right: -15px;
  cursor: default;
  border-radius: 100%;
  background: linear-gradient(180deg, #FFFFFF, #efefef);
  box-shadow: rgba(0, 0, 0, 0.3) 0 1px 10px 0;
}

#slider .cs-handle:active {
  background: linear-gradient(180deg, #EBEBEB, #DFDFDF)
}
```
