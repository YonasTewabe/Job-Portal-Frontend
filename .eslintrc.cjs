module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    // Prettier formatting as errors
    'prettier/prettier': 'error',

    // Not useful without TypeScript prop types
    'react/prop-types': 'off',

    // Plain-text apostrophes in JSX are fine
    'react/no-unescaped-entities': 'off',

    // Fast-refresh — keep as warn, not error
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // Code quality
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
    'no-console': 'warn',
    'no-debugger': 'error',
  },
};
