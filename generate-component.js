#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component template
const componentTemplate = (componentName, tagName) => `
class ${componentName} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = \`
      <div class="${tagName.toLowerCase()}">
        <span>\${this.getAttribute("label") || "${componentName} Component"}</span>
      </div>
    \`;

    const style = document.createElement("style");
    style.textContent = \`
      .${tagName.toLowerCase()} {
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: Arial, sans-serif;
      }
    \`;

    this.shadowRoot.append(style);
  }

  static get observedAttributes() {
    return ["label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const element = this.shadowRoot.querySelector("span");
    if (name === "label" && element) {
      element.textContent = newValue;
    }
  }
}

// Define component if not already defined
if (!customElements.get("${tagName}")) {
  customElements.define("${tagName}", ${componentName});
}
`;

// Stories template
const storiesTemplate = (componentName, tagName, folderPath) => `
import "./${componentName}";

export default {
  title: "CRO Components${folderPath ? '/' + folderPath : ''}/${componentName}",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" }
  }
};

const Template = ({ label }) => {
  const element = document.createElement("${tagName}");
  if (label) element.setAttribute("label", label);
  return element;
};

export const Default = Template.bind({});
Default.args = {
  label: "${componentName} Component"
};
`;

// Test template
const testTemplate = (componentName, tagName) => `
import "./${componentName}";

describe("${componentName} Component", () => {
  let component;

  beforeEach(() => {
    component = document.createElement("${tagName}");
    document.body.appendChild(component);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should render with default label", () => {
    const span = component.shadowRoot.querySelector("span");
    expect(span.textContent).toBe("${componentName} Component");
  });

  it("should update label when attribute changes", () => {
    component.setAttribute("label", "Custom Label");
    const span = component.shadowRoot.querySelector("span");
    expect(span.textContent).toBe("Custom Label");
  });
});
`;

function createComponent(componentPath) {
  // Parse the component path to handle nested folders
  const parts = componentPath.split('/');
  const componentName = parts[parts.length - 1];
  const folderPath = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
  
  // Convert component name to proper formats
  const pascalName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const kebabName = componentName.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
  const tagName = `cro-${kebabName}`;
  
  // Determine the target directory with nested folder support
  const baseDir = path.resolve(process.cwd(), "cro-components");
  const targetDir = folderPath 
    ? path.join(baseDir, folderPath, `cro-${kebabName}`)
    : path.join(baseDir, `cro-${kebabName}`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate files
  const componentFile = path.join(targetDir, `${pascalName}.js`);
  const storiesFile = path.join(targetDir, `${pascalName}.stories.js`);
  const testFile = path.join(targetDir, `${pascalName}.test.js`);

  // Write files
  fs.writeFileSync(componentFile, componentTemplate(pascalName, tagName));
  fs.writeFileSync(storiesFile, storiesTemplate(pascalName, tagName, folderPath));
  fs.writeFileSync(testFile, testTemplate(pascalName, tagName));

  console.log(`✅ Created component: ${pascalName}`);
  console.log(`📁 Location: ${targetDir}`);
  console.log(`🏷️  Tag name: <${tagName}>`);
  if (folderPath) {
    console.log(`📂 Nested path: ${folderPath}`);
  }
  console.log(`📝 Files created:`);
  console.log(`   - ${pascalName}.js`);
  console.log(`   - ${pascalName}.stories.js`);
  console.log(`   - ${pascalName}.test.js`);
}

// CLI interface
const args = process.argv.slice(2);
const componentPath = args[0];

if (!componentPath) {
  console.error('❌ Please provide a component name or path');
  console.log('Usage: node generate-component.js <ComponentName|folder/ComponentName>');
  console.log('Examples:');
  console.log('  node generate-component.js MyButton');
  console.log('  node generate-component.js forms/ContactForm');
  console.log('  node generate-component.js modals/newsletter/SignupModal');
  process.exit(1);
}

createComponent(componentPath);