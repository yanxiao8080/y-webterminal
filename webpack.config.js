const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  optimization: {
    minimize: false // 关闭代码压缩，可选
  },
  entry: "./src/index.ts",
  devtool: false,
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    library: "webterminal",
    libraryTarget: "window",
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
    // 使用 ParallelUglifyPlugin 并行压缩输出JS代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS的参数如下：
      uglifyJS: {
        output: {
          /*
           是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
           可以设置为false
          */
          beautify: false,
          /*
           是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
          */
          comments: false
        },
        compress: {
          /*
           是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
          */
          drop_console: true,

          /*
           是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
           转换，为了达到更好的压缩效果，可以设置为false
          */
          collapse_vars: true,

          /*
           是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
           var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
          */
          reduce_vars: true
        }
      },
      test: /.js$/g,
      sourceMap: false
    })
  ]
}
