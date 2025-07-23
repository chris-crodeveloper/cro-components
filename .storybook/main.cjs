// main.cjs
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(require.main.path, "../..");
const croComponentsPath = path.resolve(rootDir, "cro-components");

module.exports = {
  stories: [
    path.join(__dirname, "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"),
    ...(fs.existsSync(croComponentsPath)
      ? [path.join(croComponentsPath, "**/*.stories.@(js|jsx|ts|tsx|mdx)")]
      : [])
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-jest",
    "@storybook/addon-storysource",
    "@storybook/addon-styling-webpack",
    "@storybook/addon-webpack5-compiler-swc"
  ],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {}
  },
  webpackFinal: async (config) => {
    if (fs.existsSync(croComponentsPath)) {
      config.resolve.modules = config.resolve.modules || [];
      config.resolve.modules.push(croComponentsPath);
    }
    return config;
  }
};
