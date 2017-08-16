# circle-slider
A slider, except it's round.
Pretty good for selecting angles and stuff.

## Usage
Basic usage:
``` html
<div id="whatever"></div>
```
``` js
import CircleSlider from "circle-slider";

let cs = new CircleSlider("whatever");
```

All you have to do on the HTML side is to create a div with some id, which is the first parameter in the constructor of CircleSlider.

The div doesn't *have* to be empty, but you don't *need* to add anything for it to work; the handle will be created automatically for you.

### Options
You can make the handle snap to multiples of some number, e.g. snap to every multiple of 45 by passing 45 as the optional second parameter.
``` js
new CircleSlider("id", 45);
```

## Methods
Here is the stuff you can do with CircleSlider:

``` js
// get the current angle value
cs.getAngle();

// set the angle manually
cs.setAngle(45);

// call `callbackFunction` every time the slider is moved
cs.on("sliderMove", callbackFunction);

// get the angle with `e.detail`
cs.on("sliderMove", (e) => {
    someDiv.textContent = e.detail;
})

// call `callbackFunction` every time the handle stops moving
// same as above, get the angle with `e.detail`
cs.on("sliderUp", callbackFunction);
```

## Styling
I leave all styling up to you! Here are some good defaults to try out:

``` css
#slider {
  /* These two are pretty important */
  position: relative;
  border-radius: 100%;

  /* Other than the above two, go wild! */
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
