import fs from "fs";
import path from "path";

/** @type { import('@storybook/web-components').StorybookConfig } */

const rootDir = path.resolve(require.main.path, "../.."); // consumer's project root
const croComponentsPath = path.resolve(rootDir, "cro-components");

const config = {
  stories: [
    path.join(__dirname, "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"),
    path.join(__dirname, "../stories/**/*.mdx"),
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

export default config;
