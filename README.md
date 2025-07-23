cro-components
A collection of reusable web components for Virgin Media O2 CRO (Conversion Rate Optimization) tests, built with Storybook and designed for extensibility.

Table of Contents
Installation
Quick Start
Creating Custom Components
Scripts
Core vs Custom Components
Development Workflow
Build and Export
Testing and Linting
Dependencies
License
Installation
Install the package in your project:

bash
npm install cro-components
After installation, the package will automatically set up a cro-custom-components directory in your project root where you can add project-specific components.

Quick Start
Using Existing Components
Import and use components in your CRO tests:

javascript
// Import the component
import 'cro-components/Button';

// Use in your HTML
const button = document.createElement('cro-button');
button.setAttribute('label', 'Click Me');
button.setAttribute('type', 'primary');
document.body.appendChild(button);
Creating Your First Custom Component
Generate a new custom component:

bash
npx cro-generate MyAwesomeButton --custom
This creates a complete component structure with:

Web component implementation
Storybook stories
Jest tests
Creating Custom Components
Using the CLI Generator
The easiest way to create custom components is using the built-in CLI:

bash
# Create a custom component
npx cro-generate ComponentName --custom

# Create a core component (for maintainers)
npx cro-generate ComponentName
Manual Creation
If you prefer to create components manually, follow this structure in your cro-custom-components directory:

cro-custom-components/
├── custom-my-component/
│   ├── MyComponent.js          # Web component implementation
│   ├── MyComponent.stories.js  # Storybook stories
│   └── MyComponent.test.js     # Jest tests
Component Template
Here's a basic template for custom components:

javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div class="my-component">
        <span>${this.getAttribute("label") || "Default Label"}</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .my-component {
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: Arial, sans-serif;
      }
    `;

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

if (!customElements.get("custom-my-component")) {
  customElements.define("custom-my-component", MyComponent);
}
Scripts
Development Scripts
npm run storybook - Start Storybook development server on port 6006
npm run generate-component <name> [--custom] - Generate a new component
npm test - Run Jest tests
npm run lint:check - Check for linting errors
npm run prettier:check - Check code formatting
Build Scripts
npm run build - Build Storybook, bundle with Rollup, and generate exports
npm run build-storybook - Build Storybook static files only
npm run generate-exports - Generate package.json exports
Quality Scripts
npm run source:check - Run both linting and formatting checks
npm run source:fix - Auto-fix linting and formatting issues
Core vs Custom Components
Core Components (Package Maintainers)
Located in ./stories/, these are the base components provided by the package:

Button (cro-button) - Configurable button component
Header (cro-header) - Header component with customizable text
Overlay (cro-overlay) - Full-screen overlay with header, body, and footer
Custom Components (Package Users)
Located in ./cro-custom-components/, these are project-specific extensions:

Automatically prefixed with "Custom" in exports to avoid conflicts
Appear under "Custom/" category in Storybook
Follow the same testing and documentation standards
Development Workflow
1. Start Development Environment
bash
npm run storybook
2. Create a New Component
bash
npx cro-generate MyNewComponent --custom
3. Develop and Test
Edit your component in cro-custom-components/custom-my-new-component/
View it in Storybook at http://localhost:6006
Run tests with npm test
4. Build for Production
bash
npm run build
Your custom components will be automatically included in the build and available for export.

Build and Export
The build process automatically:

Discovers Components: Scans both core (./stories/) and custom (./cro-custom-components/) directories
Bundles with Rollup: Creates optimized ES modules in the ./dist/ folder
Generates Exports: Updates package.json with proper export paths
Creates Type Definitions: Generates TypeScript definitions for better IDE support
Builds Storybook: Creates static documentation site
Export Structure
Components are exported using this pattern:

javascript
// Core components
import 'cro-components/Button';
import 'cro-components/Header';
import 'cro-components/Overlay';

// Custom components (prefixed with "Custom")
import 'cro-components/CustomMyButton';
Testing and Linting
Running Tests
bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test Button.test.js     # Run specific test file
Code Quality
bash
npm run lint:check          # Check for linting errors
npm run lint:fix           # Auto-fix linting errors
npm run prettier:check     # Check formatting
npm run prettier:fix       # Auto-fix formatting
npm run source:check       # Run both linting and formatting checks
npm run source:fix         # Auto-fix both linting and formatting
Project Structure
cro-components/
├── stories/                          # Core components
│   ├── cro-button/
│   ├── cro-header/
│   └── cro-overlay/
├── cro-custom-components/            #
