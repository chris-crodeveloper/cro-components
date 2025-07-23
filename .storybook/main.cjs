const path = require("path");
const fs = require("fs");

// This will get the directory of the project that started the process,
// which is your parent project's root
const projectRoot = path.resolve(process.cwd());

// Construct the path to cro-components in the *parent project*
const croComponentsPath = path.resolve(projectRoot, "cro-components");

console.log("Loading stories from cro-components folder at:", croComponentsPath);

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

      config.module.rules.forEach((rule) => {
        if (rule.test && rule.test.toString().includes("tsx|ts|jsx|js")) {
          if (Array.isArray(rule.include)) {
            rule.include.push(croComponentsPath);
          } else if (rule.include) {
            rule.include = [rule.include, croComponentsPath];
          } else {
            rule.include = [croComponentsPath];
          }
        }
      });
    }
    return config;
  },
};
