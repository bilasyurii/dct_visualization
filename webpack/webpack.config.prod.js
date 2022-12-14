const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
});
