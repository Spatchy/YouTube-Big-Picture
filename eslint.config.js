import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    ignores: [
      'dist/**/*',
      'dist/**',
      "eslint.config.js",
      "webpack.config.cjs"
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      "semi": "error",
      "semi-style": "error",
      "semi-spacing": "error",
      "brace-style": "error",
      "no-trailing-spaces": "error",
      "arrow-parens": "error",
      "arrow-spacing": "error",
      "block-spacing": "error",
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "comma-dangle": "error",
      "comma-spacing": "error",
      "comma-style": "error",
      "spaced-comment": "error",
      "eol-last": "error",
      "jsx-quotes": "error",
      "key-spacing": "error",
      "max-statements-per-line": "error",
      "multiline-comment-style": "error",
      "lines-between-class-members": "error",
      "keyword-spacing": "error",
      "new-parens": "error",
      "implicit-arrow-linebreak": "error",
      "no-confusing-arrow": "error",
      "no-extra-semi": "error",
      "no-floating-decimal": "error",
      "no-mixed-operators": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-multi-spaces": "error",
      "rest-spread-spacing": "error",
      "no-whitespace-before-property": "error",
      "space-before-blocks": "error",
      "nonblock-statement-body-position": "error",
      "object-property-newline": "error",
      "wrap-iife": "error",
      "wrap-regex": "error",
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "padded-blocks": ["error", "never"],
      "template-curly-spacing": ["error", "never"],
      "template-tag-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "computed-property-spacing": ["error", "always"],
      "dot-location": ["error", "property"],
      "operator-linebreak": ["error", "before"],
      "array-bracket-spacing": ["error", "always"],
      "multiline-ternary": ["error", "always-multiline"],
      "function-paren-newline": ["error", "multiline"],
      "generator-star-spacing": ["error", "after"],
      "yield-star-spacing": ["error", "after"],
      "max-len": ["error", { "code": 120, "ignoreUrls": true }],
      "newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }],
      "array-bracket-newline": ["error", { "multiline": true, "minItems": 3 }],
      "array-element-newline": ["error", { "multiline": true, "minItems": 3 }],
      "quote-props": ["error", "consistent-as-needed"],
      "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
      "lines-around-comment": ["error", { "beforeBlockComment": true, "beforeLineComment": true }],
      "space-before-function-paren": ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
      "no-extra-parens": ["error", "all", {
        "nestedBinaryExpressions": false,
        "ternaryOperandBinaryExpressions": false,
        "enforceForArrowConditionals": false,
        "enforceForFunctionPrototypeMethods": false,
        "ignoreJSX": "multi-line",
      }],
      "object-curly-newline": ["error", {
        "ObjectExpression": { "consistent": true, "minProperties": 3 },
        "ObjectPattern": { "consistent": true, "minProperties": 3 },
        "ExportDeclaration": { "consistent": true, "minProperties": 3 },
        "ImportDeclaration": "never"
      }],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "*", "next": ["return", "export"] },
        { "blankLine": "always", "prev": "import", "next": "*" },
        { "blankLine": "never", "prev": "import", "next": "import" },
      ]
    }
  }
);