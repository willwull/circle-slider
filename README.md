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

The div doesn't *have* to be empty, but you don't *need* to add anything for it to work; the handle will be created automatically for you.

Remember to use Browserify/Webpack/whatever to handle the import.

### Options
You can make the handle snap to multiples of some number, e.g. snap to every multiple of 45 by passing 45 as the optional second parameter.
``` js
new CircleSlider("id", 45);
```

You can also write the first parameter with a #:
``` js
new CircleSlider("#id");
```
Both work the same, so choose which one you prefer.

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

Since `CircleSlider` extends `EventEmitter` from the node `events` module, you can also use functions like `once` instead of `on`.

Further reading [here](https://nodejs.org/api/events.html#events_class_eventemitter).

## Styling
I leave most styling up to you! Here are some good defaults to get started with:

``` css
#slider {
  /* These two are pretty important */
  position: relative;
  border-radius: 100%;

  /* Other than the above two, go wild! */
  height: 300px;
  width: 300px;
  background: linear-gradient(90deg, #FF9A9E, #FAD0C4);
}

#slider .cs-handle-container {
  /* probably best to paste this exactly as is */
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
}

#slider .cs-handle {
  /* This is the handle itself, you're free to do anything here */
  cursor: default;
  position: absolute;
  right: -15px;
  transform: translateY(-50%);
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: linear-gradient(180deg, #FFFFFF, #efefef);
  box-shadow: rgba(0, 0, 0, 0.3) 0 1px 10px 0;
}

#slider .cs-handle:active {
  background: linear-gradient(180deg, #EBEBEB, #DFDFDF)
}
```
