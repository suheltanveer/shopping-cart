const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js"
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      meta: {
        "theme-color": "#131f97"
      },
      favicon: "./src/images/favicon.png"
    })
  ],

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: {
          loader: "eslint-loader"
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "images"
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "fonts"
          }
        }
      }
    ]
  }
};
