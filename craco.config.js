const path = require("path");
const { CracoAliasPlugin, configPaths } = require("react-app-rewire-alias");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias["pdfjs-dist"] = path.join(
        __dirname,
        "./node_modules/pdfjs-dist/legacy/build/pdf"
      );
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {
        aliases: configPaths("./tsconfig.paths.json"),
      },
    },
  ],
};
