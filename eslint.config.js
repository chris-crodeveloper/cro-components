/** @type {import('eslint').FlatConfig} */
export default [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    rules: {
      // ESLint's recommended rules directly defined here
      "no-console": "warn", // Example rule from eslint:recommended
      "no-unused-vars": "warn",
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
    },
  },
];