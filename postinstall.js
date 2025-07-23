#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create cro-components directory structure
function setupCroComponents() {
  const croComponentsDir = path.resolve(process.cwd(), "cro-components");
  
  if (!fs.existsSync(croComponentsDir)) {
    fs.mkdirSync(croComponentsDir, { recursive: true });
    
    // Create a README for the cro-components directory
    const readmeContent = `# CRO Components

This directory is for your project-specific CRO components that extend the base cro-components library.

## Creating a New Component

Use the CLI tool to generate a new component:

\`\`\`bash
npx cro-generate MyButton
\`\`\`

## Creating Nested Components

You can organize components in folders:

\`\`\`bash
npx cro-generate forms/ContactForm
npx cro-generate modals/newsletter/SignupModal
npx cro-generate buttons/social/FacebookButton
\`\`\`

This will create:
- \`cro-my-button/MyButton.js\` - The component implementation
- \`cro-my-button/MyButton.stories.js\` - Storybook stories
- \`cro-my-button/MyButton.test.js\` - Jest tests

## Component Structure

Each component should follow this structure:

\`\`\`
cro-components/
├── cro-component-name/
│   ├── ComponentName.js          # Web component implementation
│   ├── ComponentName.stories.js  # Storybook stories
│   └── ComponentName.test.js     # Jest tests
├── forms/
│   └── cro-contact-form/
│       ├── ContactForm.js
│       ├── ContactForm.stories.js
│       └── ContactForm.test.js
└── README.md
\`\`\`

## Building and Exporting

Your components will be automatically included when you run:

\`\`\`bash
npm run build
\`\`\`

They will be exported using their component name (e.g., \`MyButton\`, \`ContactForm\`).

## Storybook Integration

Components will automatically appear in Storybook organized by their folder structure:

- \`CRO Components/MyButton\`
- \`CRO Components/forms/ContactForm\`
- \`CRO Components/modals/newsletter/SignupModal\`

Start Storybook with:

\`\`\`bash
npm run storybook
\`\`\`

## Component Usage

In your CRO tests:

\`\`\`javascript
// Import the component
import 'cro-components/MyButton';

// Use the component
const button = document.createElement('cro-my-button');
button.setAttribute('label', 'Click Me');
document.body.appendChild(button);
\`\`\`
`;

    fs.writeFileSync(path.join(croComponentsDir, "README.md"), readmeContent);
    
    console.log("✅ Created cro-components directory");
    console.log("📖 Added README with usage instructions");
  }
}

// Add build script to user's package.json
function addBuildScript() {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Add build script if it doesn't exist
    if (!packageJson.scripts["build-cro-components"]) {
      packageJson.scripts["build-cro-components"] = "npx cro-build";
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log("✅ Added 'build-cro-components' script to package.json");
    }
  }
}
// Create or update gitignore to include exports but exclude cro components
function updateGitignore() {
  const gitignorePath = path.resolve(process.cwd(), ".gitignore");
  const gitignoreEntries = [
    "",
    "# CRO Components",
    "cro-component-exports/",
    "storybook-static/",
    "coverage/",
    "",
    "# Keep cro components",
    "!cro-components/"
  ];
  
  let existingContent = "";
  if (fs.existsSync(gitignorePath)) {
    existingContent = fs.readFileSync(gitignorePath, "utf-8");
  }
  
  // Only add entries that don't already exist
  const newEntries = gitignoreEntries.filter(entry => 
    !existingContent.includes(entry) || entry === ""
  );
  
  if (newEntries.length > 0) {
    fs.appendFileSync(gitignorePath, newEntries.join("\n"));
    console.log("✅ Updated .gitignore");
  }
}

// Check if we're in a consuming project (not the CRO components package itself)
function isConsumingProject() {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson.name !== "cro-components";
}

// Main setup function
function setup() {
  if (!isConsumingProject()) {
    console.log("⏭️  Skipping setup - running in CRO components package itself");
    return;
  }
  
  console.log("🚀 Setting up CRO Components extensibility...");
  
  try {
    setupCroComponents();
    addBuildScript();
    updateGitignore();
    updateGitignore();
    
    console.log("✅ Setup complete!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Create a component: npx cro-generate MyComponent");
    console.log("2. Create nested component: npx cro-generate forms/ContactForm");
    console.log("3. Build your components: npm run build-cro-components");
    console.log("4. Start Storybook: npm run storybook");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setup();