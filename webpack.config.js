const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const GenerateJsonFromJsPlugin = require("generate-json-from-js-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  entry: {
    "js/content": "./src/app/content.ts",
    "js/background": "./src/app/background.ts",
    "js/popup": "./src/ui/popup.tsx",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./build"),
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader", exclude: /manifest.js/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new CopyPlugin({
      patterns: [{ from: "./pdfjs_static" }, { from: "./src/public" }],
      options: { concurrency: 100 },
    }),

    new GenerateJsonFromJsPlugin({
      path: "./src/manifest.js",
      filename: "manifest.json",
    }),
  ],
};
