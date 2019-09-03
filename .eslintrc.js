module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'arrow-parens': 0,
    'import/no-unresolved': 0,
    'linebreak-style': 0,
    'react/jsx-filename-extension': 0,
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".css",
          ".jsx"
        ]
      }
    }
  }
};
