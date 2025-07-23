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

// Get the path to the CRO components package
function getCROPackagePath() {
  try {
    // Try multiple resolution methods
    let packagePath;
    
    // Method 1: Direct require.resolve
    try {
      packagePath = path.dirname(require.resolve("cro-components/package.json"));
      return packagePath;
    } catch (e) {}
    
    // Method 2: Check node_modules directly
    try {
      packagePath = path.resolve(process.cwd(), "node_modules/cro-components");
      if (fs.existsSync(path.join(packagePath, "package.json"))) {
        return packagePath;
      }
    } catch (e) {}
    
    // Method 3: Check global node_modules (for npm link)
    try {
      const { execSync } = require('child_process');
      const globalPath = execSync('npm root -g', { encoding: 'utf8' }).trim();
      packagePath = path.join(globalPath, "cro-components");
      if (fs.existsSync(path.join(packagePath, "package.json"))) {
        return packagePath;
      }
    } catch (e) {}
    
    throw new Error("Package not found in any location");
    
  } catch (error) {
    console.error("❌ Could not find cro-components package");
    console.error("   Make sure cro-components is installed: npm install cro-components");
    console.error("   Debug info:", error.message);
    process.exit(1);
  }
}

// Copy necessary build configuration from the package
function setupBuildConfig() {
  const croPackagePath = getCROPackagePath();
  const projectRoot = process.cwd();
  
  // Files to copy from the package
  const filesToCopy = [
    "rollup.config.js",
    "generate-exports.js"
  ];
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(croPackagePath, file);
    const destPath = path.join(projectRoot, `.cro-temp-${file}`);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

// Clean up temporary files
function cleanup() {
  const tempFiles = [
    ".cro-temp-rollup.config.js",
    ".cro-temp-generate-exports.js"
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
    setupBuildConfig();
    
    // Run rollup build
    console.log("📦 Bundling components with Rollup...");
    const rollupProcess = spawn("npx", ["rollup", "-c", ".cro-temp-rollup.config.js"], {
      stdio: "inherit",
      shell: true
    });
    
    rollupProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Rollup build completed");
        
        // Generate exports
        console.log("📝 Generating exports...");
        const exportProcess = spawn("node", [".cro-temp-generate-exports.js"], {
          stdio: "inherit",
          shell: true
        });
        
        exportProcess.on("close", (exportCode) => {
          cleanup();
          
          if (exportCode === 0) {
            console.log("🎉 Build completed successfully!");
            console.log("📁 Components exported to: ./cro-component-exports/");
            console.log("");
            console.log("Next steps:");
            console.log("1. Import your components: import './cro-component-exports/MyComponent.js'");
            console.log("2. Use in your CRO tests: document.createElement('cro-my-component')");
          } else {
            console.error("❌ Export generation failed");
            process.exit(1);
          }
        });
        
        exportProcess.on("error", (error) => {
          cleanup();
          console.error("❌ Export generation error:", error);
          process.exit(1);
        });
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