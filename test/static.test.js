const CircleSlider = require("../src/index");

// tests of the static methods of CircleSlider

test("_radToDeg converts correctly", () => {
  // probably overkill to test such a simple method
  const rtd = CircleSlider._radToDeg;
  expect(rtd(0)).toBeCloseTo(0);
  expect(rtd(Math.PI / 6)).toBeCloseTo(30);
  expect(rtd(Math.PI / 4)).toBeCloseTo(45);
  expect(rtd(Math.PI / 3)).toBeCloseTo(60);
  expect(rtd(Math.PI / 2)).toBeCloseTo(90);
});

test("_modulo gives correct values", () => {
  const mod = CircleSlider._modulo;
  expect(mod(0, 360)).toBe(0);
  expect(mod(360, 360)).toBe(0);
  expect(mod(361, 360)).toBe(1);
  expect(mod(359, 360)).toBe(359);
  expect(mod(720, 360)).toBe(0);
});

test("create handle element", () => {
  const res = CircleSlider._createHandleElem();
  expect(res).not.toBeFalsy();
  expect(res.tagName).toBe("DIV");
  expect(res.className).toBe("cs-handle");
});

test("create handle container", () => {
  const res = CircleSlider._createHandleContainerElem();
  expect(res).not.toBeFalsy();
  expect(res.tagName).toBe("DIV");
  expect(res.className).toBe("cs-handle-container");
});
