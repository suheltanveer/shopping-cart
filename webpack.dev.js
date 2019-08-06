const merge = require("webpack-merge");
const common = require("./webpack.common");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  plugins: [new ExtractTextPlugin("styles.css")],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ExtractTextPlugin.extract([
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ])
      }
    ]
  }
});
