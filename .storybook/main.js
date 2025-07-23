import fs from "fs";
import path from "path";

/** @type { import('@storybook/web-components').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../stories/**/*.mdx",
    // Include cro-components stories if directory exists
    ...(fs.existsSync(path.resolve(process.cwd(), "cro-components"))
      ? ["../cro-components/**/*.stories.@(js|jsx|ts|tsx|mdx)"]
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
  // Remove staticDirs since public directory doesn't exist
  // If you want to add static assets later, create a public directory and uncomment:
  // staticDirs: ["../public"],
  
  webpackFinal: async (config) => {
    // Add cro-components path to webpack resolve
    const croComponentsPath = path.resolve(process.cwd(), "cro-components");
    if (fs.existsSync(croComponentsPath)) {
      config.resolve.modules.push(croComponentsPath);
    }
    return config;
  }
};

export default config;