const path = require("path");

module.exports = {
  entry: "./src/demo.js",
  devtool: "cheap-eval-source-map",
  devServer: {
    contentBase: path.resolve(__dirname),
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  output: {
    filename: "demo.build.js",
    path: path.resolve(__dirname, "src"),
    publicPath: "src/",
  },
};
