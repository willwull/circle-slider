const path = require("path");

module.exports = {
  entry: "./demo/demo.js",
  devtool: "cheap-eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "demo"),
    watchContentBase: true,
  },
  output: {
    filename: "demo.build.js",
    path: path.resolve(__dirname, "demo"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        // enable importing CSS in JS
        // to use hot reloading for CSS, must import it in JS
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
