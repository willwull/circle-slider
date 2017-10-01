const CircleSlider = require("../lib/index.js");

const options = {
  snap: 90,
  clockwise: true,
};
const cs = new CircleSlider("#slider", options);
const targetDiv = document.getElementById("angle");

cs.on("sliderMove", (angle) => {
  targetDiv.innerHTML = `&nbsp;${angle}&deg;`;
});

cs.on("sliderUp", (angle) => {
  console.log(`sliderUp ${angle}`);
});
