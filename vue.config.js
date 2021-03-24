const path = require("path");

const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const outputDir = process.env.OUTPUT_DIR || "dist";
const publicPath = process.env.PUBLIC_PATH || "/";

module.exports = {
  chainWebpack: config => {
    config.plugins.delete("html");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
  },
  configureWebpack: {
    devServer: {
      writeToDisk: true
    },
    plugins: [new CleanWebpackPlugin(), new WebpackManifestPlugin()]
  },
  outputDir: path.resolve(__dirname, outputDir),
  pluginOptions: {
    i18n: {
      locale: "pl",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },
  publicPath,
  transpileDependencies: ["vuetify"]
};
