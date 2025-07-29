import fs from "fs";
import path from "path";
import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

// Configuration for component directories
const componentDirs = [
  path.resolve("stories"), // Core CRO components (for package maintainers)
  path.resolve("cro-components") // User-defined components
];

// Check if cro-components directory exists in the project root
const croComponentsPath = path.resolve(process.cwd(), "cro-components");
if (fs.existsSync(croComponentsPath)) {
  componentDirs.push(croComponentsPath);
}

// Recursive function to get all files in a directory and its subdirectories
function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory() ? getFiles(fullPath) : fullPath;
  });
}

// Dynamically generate the input object, excluding `*.stories.js` files
const components = componentDirs.reduce((allComponents, dir) => {
  const files = getFiles(dir)
    .filter(
      file =>
        (file.endsWith(".js") || file.endsWith(".ts")) && // Only .js and .ts files
        !file.endsWith(".stories.js") && // Exclude .stories.js files
        !file.endsWith(".test.js") // Exclude test files
    );

  files.forEach(file => {
    const name = path.basename(file, path.extname(file));
    // All components use their actual name - no prefixing needed
    allComponents[name] = file;
  });

  return allComponents;
}, {});

console.log("Found components:", Object.keys(components));

// Rollup configuration
export default defineConfig({
  input: components,
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "[name].js"
  },
  plugins: [
    resolve(),
    commonjs(),
    terser({
      // Minimal terser config for web components
      compress: {
        // Only do basic compression
        dead_code: true,
        drop_debugger: true,
        drop_console: false, // Keep console for debugging
        // Don't mess with anything else
        sequences: false,
        conditionals: false,
        booleans: false,
        loops: false,
        unused: false,
        hoist_funs: false,
        keep_fargs: true,
        keep_fnames: true
      },
      mangle: {
        // Don't mangle anything
        reserved: ['className', 'setAttribute', 'getAttribute', 'innerHTML', 'textContent', 'shadowRoot', 'customElements'],
        properties: false
      },
      format: {
        // Keep readable format
        beautify: false,
        comments: false,
        quote_style: 1,
        keep_quoted_props: true,
        semicolons: true
      }
    })
  ]
});