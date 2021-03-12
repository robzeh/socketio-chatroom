const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = (config) => {
  config.resolve.plugins.pop();

  // resolve path aliases
  config.resolve.plugins.push(new TsconfigPathsPlugin());

  // babel compile outside of src
  const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
  const tsRule = oneOfRule.oneOf.find((rule) =>
    rule.test.toString().includes("ts|tsx")
  );
  tsRule.include = undefined;
  tsRule.exclude = /node_modules/;

  return config;
};