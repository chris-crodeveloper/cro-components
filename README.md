# cro-components

A collection of reusable web components for CRO (Conversion Rate Optimization) tests, built with Storybook and designed for extensibility.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Creating Components](#creating-components)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [Build and Export](#build-and-export)
- [Testing and Linting](#testing-and-linting)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

Install the package in your project:

```bash
npm install cro-components
```

### Manual Setup (if automatic setup doesn't run)

If the automatic setup doesn't create the `cro-components` directory, run the setup manually:

```bash
# Option 1: Using the CLI command
npx cro-setup

# Option 2: Run the script directly
node node_modules/cro-components/postinstall.js

# Option 3: If using npm link during development
node path/to/your/cro-components/postinstall.js
```

This will:
- Create the `cro-components/` directory in your project root
- Add the `build-cro-components` script to your package.json
- Update your `.gitignore` file
- Provide a detailed README in the components directory

## Quick Start

### Using Existing Core Components

Import and use the core components in your CRO tests:

```javascript
// Import the component files
import './cro-component-exports/Button.js';

// Use in your HTML
const button = document.createElement('cro-button');
button.setAttribute('label', 'Click Me');
button.setAttribute('type', 'primary');
document.body.appendChild(button);
```

### Creating Your First Component

Generate a new component:

```bash
npx cro-generate MyAwesomeButton
```

This creates a complete component structure with:
- Web component implementation
- Storybook stories  
- Jest tests

## Creating Components

### Using the CLI Generator

The easiest way to create components is using the built-in CLI:

```bash
# Create a simple component
npx cro-generate ComponentName

# Create nested components for organization
npx cro-generate forms/ContactForm
npx cro-generate modals/newsletter/SignupModal
npx cro-generate buttons/social/FacebookButton
```

### Component Structure

Each component follows this structure:

```
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
```

### Component Template

Here's a basic template for components:

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div class="cro-my-component">
        <span>${this.getAttribute("label") || "Default Label"}</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .cro-my-component {
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

if (!customElements.get("cro-my-component")) {
  customElements.define("cro-my-component", MyComponent);
}
```

## Scripts

### Available Scripts

- `npm run build-cro-components` - Build your components for production use
- `npx cro-generate <ComponentName>` - Generate a new component
- `npx cro-setup` - Set up the CRO components directory (manual setup)
- `npx cro-build` - Build components (alternative to npm script)

### Core Components Available

The package includes these core components:

- **Button** (`cro-button`) - Configurable button component
- **Header** (`cro-header`) - Header component with customizable text  
- **Overlay** (`cro-overlay`) - Full-screen overlay with header, body, and footer

## Development Workflow

### 1. Set Up Your Project

```bash
npm install cro-components
# If setup didn't run automatically:
npx cro-setup
```

### 2. Create Components

```bash
# Simple component
npx cro-generate MyButton

# Nested component for organization
npx cro-generate forms/ContactForm
```

### 3. Develop and Test

- Edit your component in `cro-components/cro-my-button/`
- Start Storybook to preview: `npm run storybook` (if Storybook is set up)
- Run tests: `npm test`

### 4. Build for Production

```bash
npm run build-cro-components
```

Your components will be built to `./cro-component-exports/`

### 5. Use in CRO Tests

```javascript
// Import your built components
import './cro-component-exports/MyButton.js';
import './cro-component-exports/ContactForm.js';

// Use them in your CRO tests
const button = document.createElement('cro-my-button');
button.setAttribute('label', 'Special Offer');
document.body.appendChild(button);
```

## Build and Export

The build process automatically:

1. **Discovers Components**: Scans your `cro-components/` directory recursively
2. **Bundles with Rollup**: Creates optimized ES modules in `./cro-component-exports/`
3. **Generates Exports**: Updates your `package.json` with proper export paths
4. **Creates Type Definitions**: Generates TypeScript definitions for better IDE support

### Export Structure

After building, components are available as:

```javascript
// Your custom components
import './cro-component-exports/MyButton.js';
import './cro-component-exports/ContactForm.js';
import './cro-component-exports/SignupModal.js';

// Core components (if you've imported them)
import './cro-component-exports/Button.js';
import './cro-component-exports/Header.js';
import './cro-component-exports/Overlay.js';
```

## Testing and Linting

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test MyButton.test.js   # Run specific test file
```

### Code Quality (if ESLint/Prettier are set up in your project)

```bash
npm run lint:check          # Check for linting errors
npm run lint:fix           # Auto-fix linting errors
npm run prettier:check     # Check formatting
npm run prettier:fix       # Auto-fix formatting
```

## Project Structure

```
your-project/
├── cro-components/                   # Your component source files
│   ├── cro-my-button/
│   │   ├── MyButton.js
│   │   ├── MyButton.stories.js
│   │   └── MyButton.test.js
│   ├── forms/
│   │   └── cro-contact-form/
│   │       ├── ContactForm.js
│   │       ├── ContactForm.stories.js
│   │       └── ContactForm.test.js
│   └── README.md
├── cro-component-exports/            # Built components (generated)
│   ├── MyButton.js
│   ├── ContactForm.js
│   └── index.d.ts
├── node_modules/
│   └── cro-components/               # This package
├── package.json                      # Auto-updated with exports
└── .gitignore                        # Auto-updated
```

## Advanced Usage

### Component Styling Best Practices

1. **Use Shadow DOM**: All components use Shadow DOM for style encapsulation
2. **CSS Custom Properties**: Use CSS variables for theming:

```javascript
style.textContent = `
  .my-component {
    background: var(--component-bg, #ffffff);
    color: var(--component-color, #333333);
    padding: var(--component-padding, 16px);
  }
`;
```

3. **Responsive Design**: Ensure components work across different screen sizes
4. **Accessibility**: Include proper ARIA attributes and keyboard navigation

### Integration with CRO Tools

#### Optimizely Integration

```javascript
import './cro-component-exports/MyButton.js';

const button = document.createElement('cro-my-button');
button.setAttribute('label', 'Get Started');

// Add event tracking
button.addEventListener('click', () => {
  window.optimizely = window.optimizely || [];
  window.optimizely.push({
    type: 'event',
    eventName: 'cro_button_click',
    tags: {
      component: 'cro-my-button',
      label: 'Get Started'
    }
  });
});

document.querySelector('.target-container').appendChild(button);
```

#### Google Optimize Integration

```javascript
import './cro-component-exports/MyOverlay.js';

const overlay = document.createElement('cro-my-overlay');
overlay.setAttribute('header', 'Special Offer!');

// Track interactions
overlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-button')) {
    gtag('event', 'overlay_close', {
      event_category: 'CRO',
      event_label: 'Special Offer Overlay'
    });
  }
});
```

## Troubleshooting

### Common Issues

1. **Components not building**
   - Ensure you've run `npx cro-setup` or `node node_modules/cro-components/postinstall.js`
   - Check that `cro-components/` directory exists
   - Verify component files end with `.js` and not `.stories.js` or `.test.js`

2. **Build script not found**
   - Run the manual setup: `npx cro-setup`
   - Or add manually to package.json: `"build-cro-components": "npx cro-build"`

3. **Components not appearing in exports**
   - Check file naming convention
   - Ensure files are in the correct directory structure
   - Run `npm run build-cro-components` to rebuild

### Debug Commands

```bash
# Check what components are being discovered
ls -la cro-components/

# Validate component syntax
node -c cro-components/cro-my-button/MyButton.js

# Check if build script exists
cat package.json | grep build-cro-components
```

## Dependencies

### Key Dependencies

- **Rollup**: JavaScript bundler for creating optimized ES modules
- **Node.js**: Runtime for the build tools
- **npm**: Package manager

### Optional Dependencies

- **Storybook**: Component development and documentation environment
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions:

1. Check the GitHub Issues page
2. Review the component documentation in your `cro-components/README.md`
3. Test components using the build and export workflow

---

**Made for better conversion optimization** 🚀