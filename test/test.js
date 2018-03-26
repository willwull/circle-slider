const CircleSlider = require("../src/index");

test("_radToDeg converts correctly", () => {
  // probably overkill to test such a simple method
  const rtd = CircleSlider._radToDeg;
  expect(rtd(0)).toBeCloseTo(0);
  expect(rtd(Math.PI / 6)).toBeCloseTo(30);
  expect(rtd(Math.PI / 4)).toBeCloseTo(45);
  expect(rtd(Math.PI / 3)).toBeCloseTo(60);
  expect(rtd(Math.PI / 2)).toBeCloseTo(90);
});
