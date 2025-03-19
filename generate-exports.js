import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the dist folder and package.json
const distFolder = path.resolve(__dirname, "./dist");
const packageJsonPath = path.resolve(__dirname, "./package.json");

// Read the files in the dist folder
const files = fs.readdirSync(distFolder).filter(file => file.endsWith(".js"));

// Generate the exports object
const exports = files.reduce((acc, file) => {
  const name = `./${path.basename(file, ".js")}`;
  acc[name] = `./dist/${file}`;
  return acc;
}, {});

// Read and update package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.exports = exports;

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
