import path from 'path'

 export default {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: [
    '@storybook/addon-essentials', // Includes controls, docs, actions, etc.
  ],
  webpackFinal: async (config) => {
    // Add custom rules if needed (e.g., for TypeScript or SCSS)
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // Add your paths if you have custom elements
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, '../stories'),
    };

    return config;
  },
};
