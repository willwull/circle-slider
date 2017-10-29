const CircleSlider = require("./index.js");

const options = {
  snap: 45,
  clockwise: false,
  startPos: "bottom",
};
const cs = new CircleSlider("#slider", options);
const targetDiv = document.getElementById("angle");

cs.on("sliderMove", (angle) => {
  targetDiv.innerHTML = `&nbsp;${angle}&deg;`;
});

cs.on("sliderUp", (angle) => {
  console.log(`sliderUp ${angle}`);
});

const btn = document.getElementById("slider-set-angle");
btn.addEventListener("click", (e) => {
  e.preventDefault();
  const val = document.getElementById("slider-form-value").value;
  cs.setAngle(val);
});
