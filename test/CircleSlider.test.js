const CircleSlider = require("../src/index");

describe("creating new instance", () => {
  let div;

  beforeEach(() => {
    div = document.createElement("div");
    div.id = "id";
    document.body.appendChild(div);
  });

  test("no args throws", () => {
    expect(() => {
      new CircleSlider();
    }).toThrow();
  });

  test("invalid id (element doesn't exist) throws", () => {
    console.error = jest.fn();
    expect(() => {
      new CircleSlider("doesntexist");
    }).toThrow();
    expect(console.error).toBeCalled();
  });

  test("valid id doesn't throw", () => {
    expect(() => {
      new CircleSlider("id");
    }).not.toThrow();
    expect(() => {
      new CircleSlider("#id");
    }).not.toThrow();
  });

  test("options argument doesn't throw", () => {
    expect(() => {
      new CircleSlider("id", {});
    }).not.toThrow();

    expect(() => {
      const options = { snap: 5 };
      new CircleSlider("id", options);
    }).not.toThrow();

    expect(() => {
      const options = { clockwise: true };
      new CircleSlider("id", options);
    }).not.toThrow();

    expect(() => {
      const options = { startPos: "top" };
      new CircleSlider("id", options);
    }).not.toThrow();

    expect(() => {
      const options = {
        snap: 5,
        clockwise: true,
        startPos: "top",
      };
      new CircleSlider("id", options);
    }).not.toThrow();
  });
});
