module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:typescript-sort-keys/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    project: ["tsconfig.json", "scripts/tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "sort-keys-fix",
    "typescript-sort-keys",
    "simple-import-sort",
  ],
  rules: {
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/dot-notation": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/method-signature-style": "warn",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/sort-type-union-intersection-members": "warn",
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "react/jsx-boolean-value": ["warn", "always"],
    "react/jsx-fragments": "warn",
    "react/jsx-handler-names": "warn",
    "react/jsx-no-useless-fragment": "warn",
    "react/jsx-pascal-case": "warn",
    "react/jsx-props-no-spreading": "warn",
    "react/jsx-sort-props": "warn",
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": "warn",
  },
  overrides: [
    {
      files: ["src/modules/**/*"],
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
      },
    },
  ],
};
