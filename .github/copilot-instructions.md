# TypeScript Library Project Instructions

This is a TypeScript library project for npm publication with the following features:

- TypeScript compilation
- Jest testing framework
- ESLint and Prettier for code quality
- GitHub Actions CI/CD pipeline
- Semantic release for automated versioning
- NPM package publishing

## Development Workflow

1. Write TypeScript code in `src/` directory
2. Write tests in `__tests__/` directory
3. Run `npm test` to execute tests
4. Run `npm run build` to compile TypeScript
5. Use semantic commit messages for automatic versioning
6. Push to GitHub to trigger CI/CD pipeline

## Commit Convention

Use conventional commits for automatic version bumping:

- `feat:` for new features (minor version)
- `fix:` for bug fixes (patch version)
- `BREAKING CHANGE:` for breaking changes (major version)

## Target Environment

- Node.js v22.13.1
- TypeScript library for npm distribution
