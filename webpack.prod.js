const merge = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
      ignoreOrder: false // Enable to remove warnings about conflicting order
    })
  ],

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  }
});
