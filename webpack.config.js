const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false // 关闭代码压缩，可选
  },
  entry: "./src/index.ts",
  devtool: false,
  devServer: {
    contentBase: './dist'
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    environment: {
      arrowFunction: false // 关闭webpack的箭头函数，可选
    }
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.ts$/i, use: { loader: "ts-loader" }, exclude: /node_modules/ }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{from: path.join(__dirname, 'src/style'),to: path.join(__dirname, 'dist/style')}]
    })
  ]
}
