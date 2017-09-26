const CircleSlider = require("../lib/index.js");

const cs = new CircleSlider("#slder", 45);
const targetDiv = document.getElementById("angle");

cs.on("sliderMove", (angle) => {
  targetDiv.innerHTML = `&nbsp;${angle}&deg;`;
});

cs.on("sliderUp", (angle) => {
  console.log(`sliderUp ${angle}`);
});
