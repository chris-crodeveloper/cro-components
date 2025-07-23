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
  
  // Check if package is installed (either as dependency or via npm link)
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const hasPackageDependency = packageJson.dependencies?.["cro-components"] || 
                               packageJson.devDependencies?.["cro-components"];
  
  // More robust check for linked package
  const nodeModulesPath = path.resolve(process.cwd(), "node_modules/cro-components");
  const hasLinkedPackage = fs.existsSync(nodeModulesPath);
  
  // Additional check for package.json in the linked location
  const hasValidPackage = hasLinkedPackage && fs.existsSync(path.join(nodeModulesPath, "package.json"));
  
  // Debug mode - skip validation if --force flag is used
  const forceMode = process.argv.includes('--force');
  
  if (!hasPackageDependency && !hasValidPackage && !forceMode) {
    console.error("❌ cro-components not found");
    console.error("   Install it: npm install cro-components");
    console.error("   Or link it: npm link cro-components");
    console.error("   Or force run: npx cro-build --force");
    console.error("");
    console.error("   Debug info:");
    console.error(`     Has dependency: ${hasPackageDependency}`);
    console.error(`     Node modules exists: ${hasLinkedPackage}`);
    console.error(`     Package.json exists: ${hasValidPackage}`);
    console.error(`     Checking path: ${nodeModulesPath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(croComponentsDir)) {
    console.warn("⚠️  No cro-components directory found");
    console.log("   Run setup first: npx cro-setup");
    console.log("   Or create your first component: npx cro-generate MyComponent");
    return false;
  }
  
  if (forceMode) {
    console.log("🔧 Running in force mode - skipping package validation");
  }
  
  return true;
}

// Create inline rollup configuration
function createRollupConfig() {
  return `
import fs from "fs";
import path from "path";

// Simple minification function
function simpleMinify(code) {
  return code
    // Remove comments
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '')
    .replace(/\\/\\/.*$/gm, '')
    // Remove extra whitespace
    .replace(/\\s+/g, ' ')
    // Remove whitespace around operators and punctuation
    .replace(/\\s*([{}();,=+\\-*/<>!&|])\\s*/g, '$1')
    // Remove leading/trailing whitespace
    .trim();
}

// Simple minification plugin
const minifyPlugin = {
  name: 'simple-minify',
  generateBundle(options, bundle) {
    Object.keys(bundle).forEach(fileName => {
      const chunk = bundle[fileName];
      if (chunk.type === 'chunk') {
        chunk.code = simpleMinify(chunk.code);
      }
    });
  }
};

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
  plugins: [minifyPlugin]
};
`};

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
    
    // Check if rollup is available
    console.log("📦 Bundling components with Rollup...");
    
    // Try to use local rollup first, then npx
    const rollupCommand = fs.existsSync('./node_modules/.bin/rollup') ? 
      './node_modules/.bin/rollup' : 'npx';
    const rollupArgs = rollupCommand === 'npx' ? 
      ['rollup', '-c', configPath] : ['-c', configPath];
    
    const rollupProcess = spawn(rollupCommand, rollupArgs, {
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
        console.error("   Try installing rollup: npm install --save-dev rollup");
        process.exit(1);
      }
    });
    
    rollupProcess.on("error", (error) => {
      cleanup();
      if (error.code === 'ENOENT') {
        console.error("❌ Rollup not found");
        console.error("   Install rollup: npm install --save-dev rollup");
        console.error("   Or install globally: npm install -g rollup");
      } else {
        console.error("❌ Build error:", error);
      }
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