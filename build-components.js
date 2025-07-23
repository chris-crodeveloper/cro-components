#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in a project that has cro-components
function validateProject() {
  const croComponentsDir = path.resolve(process.cwd(), "cro-components");
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error("❌ No package.json found. Are you in a Node.js project?");
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  if (!packageJson.dependencies?.["cro-components"] && 
      !packageJson.devDependencies?.["cro-components"]) {
    console.error("❌ cro-components not found in dependencies");
    console.error("   Install it first: npm install cro-components");
    process.exit(1);
  }
  
  if (!fs.existsSync(croComponentsDir)) {
    console.warn("⚠️  No cro-components directory found");
    console.log("   Create your first component: npx cro-generate MyComponent");
    return false;
  }
  
  return true;
}

// Create inline rollup configuration
function createRollupConfig() {
  return `
import fs from "fs";
import path from "path";

// Get all component files from cro-components directory
function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isDirectory() ? getFiles(fullPath) : fullPath;
  });
}

// Find components
const croComponentsDir = path.resolve(process.cwd(), "cro-components");
const components = getFiles(croComponentsDir)
  .filter(
    file =>
      (file.endsWith(".js") || file.endsWith(".ts")) &&
      !file.endsWith(".stories.js") &&
      !file.endsWith(".test.js")
  )
  .reduce((allComponents, file) => {
    const name = path.basename(file, path.extname(file));
    allComponents[name] = file;
    return allComponents;
  }, {});

console.log("Found components:", Object.keys(components));

export default {
  input: components,
  output: {
    dir: path.resolve(process.cwd(), "cro-component-exports"),
    format: "es",
    entryFileNames: "[name].js"
  },
  plugins: []
};
`;
}

// Generate exports inline
function generateExports() {
  const exportsFolder = path.resolve(process.cwd(), "cro-component-exports");
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  
  if (!fs.existsSync(exportsFolder)) {
    console.error("❌ Exports folder not found");
    return;
  }
  
  const files = fs.readdirSync(exportsFolder).filter(file => file.endsWith(".js"));
  
  if (files.length === 0) {
    console.warn("⚠️  No JavaScript files found in exports folder");
    return;
  }
  
  // Generate exports object
  const exports = files.reduce((acc, file) => {
    const name = `./${path.basename(file, ".js")}`;
    acc[name] = `./cro-component-exports/${file}`;
    return acc;
  }, {});
  
  exports["./package.json"] = "./package.json";
  
  // Update package.json
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.exports = exports;
    
    if (!packageJson.types) {
      packageJson.types = "./cro-component-exports/index.d.ts";
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Generate basic TypeScript definitions
    const typeDefinitions = files.map(file => {
      const name = path.basename(file, ".js");
      return `export declare const ${name}: any;`;
    }).join('\n');
    
    const dtsContent = `// Auto-generated type definitions for CRO Components
${typeDefinitions}
`;
    
    fs.writeFileSync(path.resolve(process.cwd(), "cro-component-exports/index.d.ts"), dtsContent);
    
    console.log(`✅ Generated exports for ${files.length} components`);
    console.log(`📦 Updated package.json with exports`);
    console.log(`📝 Generated TypeScript definitions`);
    
    const componentNames = Object.keys(exports).filter(key => key !== "./package.json");
    if (componentNames.length > 0) {
      console.log(`🔗 Available exports:`, componentNames.join(", "));
    }
  }
}

// Clean up temporary files
function cleanup() {
  const tempFiles = [
    ".cro-temp-rollup.config.js"
  ];
  
  tempFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
}

// Run the build process
async function build() {
  console.log("🚀 Building CRO Components...");
  
  if (!validateProject()) {
    return;
  }
  
  try {
    // Create inline rollup config instead of copying files
    const rollupConfig = createRollupConfig();
    const configPath = path.resolve(process.cwd(), ".cro-temp-rollup.config.js");
    fs.writeFileSync(configPath, rollupConfig);
    
    // Run rollup build
    console.log("📦 Bundling components with Rollup...");
    const rollupProcess = spawn("npx", ["rollup", "-c", configPath], {
      stdio: "inherit"
    });
    
    rollupProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Rollup build completed");
        
        // Generate exports using inline script
        console.log("📝 Generating exports...");
        generateExports();
        
        cleanup();
        console.log("🎉 Build completed successfully!");
        console.log("📁 Components exported to: ./cro-component-exports/");
        console.log("");
        console.log("Next steps:");
        console.log("1. Import your components: import './cro-component-exports/MyComponent.js'");
        console.log("2. Use in your CRO tests: document.createElement('cro-my-component')");
      } else {
        cleanup();
        console.error("❌ Rollup build failed");
        process.exit(1);
      }
    });
    
    rollupProcess.on("error", (error) => {
      cleanup();
      console.error("❌ Build error:", error);
      process.exit(1);
    });
    
  } catch (error) {
    cleanup();
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Handle cleanup on process exit
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(1);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(1);
});

build();