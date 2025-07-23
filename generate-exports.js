import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the exports folder and package.json in the project root
const exportsFolder = path.resolve(process.cwd(), "cro-component-exports");
const packageJsonPath = path.resolve(process.cwd(), "package.json");

// Function to generate TypeScript definitions (optional enhancement)
function generateTypeDefinitions(files) {
  const typeDefinitions = files.map(file => {
    const name = path.basename(file, ".js");
    return `export declare const ${name}: any;`;
  }).join('\n');

  const dtsContent = `// Auto-generated type definitions for CRO Components
${typeDefinitions}
`;

  fs.writeFileSync(path.resolve(process.cwd(), "cro-component-exports/index.d.ts"), dtsContent);
}

// Check if exports folder exists
if (!fs.existsSync(exportsFolder)) {
  console.error("Exports folder does not exist. Run build first.");
  process.exit(1);
}

// Read the files in the exports folder
const files = fs.readdirSync(exportsFolder).filter(file => file.endsWith(".js"));

if (files.length === 0) {
  console.warn("No JavaScript files found in dist folder.");
  process.exit(0);
}

// Generate the exports object (keeping your existing logic)
const exports = files.reduce((acc, file) => {
  const name = `./${path.basename(file, ".js")}`;
  acc[name] = `./cro-component-exports/${file}`;
  return acc;
}, {});

// Add package.json to exports for tooling compatibility
exports["./package.json"] = "./package.json";

// Read and update package.json (keeping your existing approach)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.exports = exports;

// Optional: Add TypeScript support
if (!packageJson.types) {
  packageJson.types = "./cro-component-exports/index.d.ts";
}

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Optional: Generate TypeScript definitions
try {
  generateTypeDefinitions(files);
  console.log(`✅ Generated exports for ${files.length} components`);
  console.log(`📦 Updated package.json with exports configuration`);
  console.log(`📝 Generated TypeScript definitions`);
  
  // Show which components were exported
  const componentNames = Object.keys(exports).filter(key => key !== "./package.json");
  if (componentNames.length > 0) {
    console.log(`🔗 Available exports:`, componentNames.join(", "));
  }
} catch (error) {
  console.error("⚠️  Warning: Could not generate TypeScript definitions:", error.message);
  console.log(`✅ Generated exports for ${files.length} components`);
  console.log(`📦 Updated package.json with exports configuration`);
}