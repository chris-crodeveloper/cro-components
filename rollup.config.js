import fs from "fs";
import path from "path";
import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const componentsDir = path.resolve("stories"); // Path to your components folder

// Recursive function to get all files in a directory and its subdirectories
function getFiles(dir) {
  return fs.readdirSync(dir).flatMap((file) => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory() ? getFiles(fullPath) : fullPath;
  });
}

// Dynamically generate the input object, excluding `*.stories.js` files
const components = getFiles(componentsDir)
  .filter((file) =>
    (file.endsWith(".js") || file.endsWith(".ts")) && // Only .js and .ts files
    !file.endsWith(".stories.js") // Exclude .stories.js files
  )
  .reduce((entries, file) => {
    const name = path.basename(file, path.extname(file)); // Use only the file name without extension
    entries[name] = file; // Map the name to the file path
    return entries;
  }, {});

// Rollup configuration
export default defineConfig({
  input: components, // Use the generated components object as input
  output: {
    dir: "dist", // Output directory
    format: "es", // ES module format
    entryFileNames: "[name].js", // Output all files to the root of `dist`
  },
  plugins: [
    resolve(), // Resolve node_modules dependencies
    commonjs(), // Convert CommonJS to ES Modules
    terser(), // Minify the output
  ],
});
