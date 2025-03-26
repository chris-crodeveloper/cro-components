```
# @virginmediao2/cro-components

A collection of reusable components for Virgin Media O2, built with Storybook and Rollup.

## Table of Contents
- [Installation](#installation)
- [Scripts](#scripts)
- [Development](#development)
- [Build and Export](#build-and-export)
- [Testing and Linting](#testing-and-linting)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

To install the package, run the following command:

```bash
npm install
```

## Scripts

This project includes several npm scripts to help with development, building, testing, and linting.

- `test`: Run tests using Jest.
- `prettier:check`: Check if files are formatted according to Prettier rules.
- `prettier:fix`: Fix formatting issues in files.
- `lint:check`: Run ESLint to check for code issues (max warnings: 0).
- `lint:fix`: Automatically fix code issues according to ESLint rules.
- `source:check`: Run both ESLint and Prettier checks.
- `source:fix`: Automatically fix issues with ESLint and Prettier.
- `storybook`: Start Storybook development server on port 6006.
- `build-storybook`: Build Storybook static files for deployment.
- `build`: Build Storybook, bundle with Rollup, and generate exports.
- `generate-exports`: Run a custom script to generate exports.

### Example usage:

To start the Storybook development environment:

```bash
npm run storybook
```

To build the project:

```bash
npm run build
```

To check for code formatting issues:

```bash
npm run prettier:check
```

## Development

The development process includes using Storybook to view and test components in isolation.

1. To start the development environment, run:

```bash
npm run storybook
```

2. To build the Storybook static files, run:

```bash
npm run build-storybook
```

3. The components are available for export via the following paths:
    - `./Button`: Exported as `./dist/Button.js`
    - `./Header`: Exported as `./dist/Header.js`
    - `./Overlay`: Exported as `./dist/Overlay.js`

## Build and Export

To build and export the components:

```bash
npm run build
```

This will:
- Build Storybook
- Bundle the components with Rollup
- Generate the necessary exports

## Testing and Linting

To ensure code quality, this project uses ESLint and Jest for linting and testing respectively.

- To run tests, use:

```bash
npm test
```

- To check for linting errors, run:

```bash
npm run lint:check
```

- To automatically fix linting errors, use:

```bash
npm run lint:fix
```

- To check for formatting issues with Prettier:

```bash
npm run prettier:check
```

- To automatically fix formatting issues:

```bash
npm run prettier:fix
```

## Dependencies

This project uses the following key dependencies:

- `@storybook`: To create the Storybook environment for developing components.
- `rollup`: Bundler for JavaScript components.
- `eslint`: Linting tool to enforce coding standards.
- `jest`: Testing framework.
- `prettier`: Code formatting tool.

For a full list of dependencies, see the `package.json`.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
```
