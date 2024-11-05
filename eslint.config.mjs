import reactCompiler from "eslint-plugin-react-compiler";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "airbnb",
    "prettier",
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
), {
    plugins: {
        "react-compiler": reactCompiler,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            React: true,
        },

        ecmaVersion: 12,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        "no-console": ["warn", {
            allow: ["error"],
        }],

        "consistent-return": "off",
        "react/require-default-props": "off",
        "react-compiler/react-compiler": "error",
        "no-shadow": "off",
        "arrow-body-style": "off",
        "import/extensions": "off",
        curly: ["error", "multi"],
        "react/button-has-type": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-filename-extension": "off",
        "react/jsx-props-no-spreading": "off",
        "import/prefer-default-export": "off",
        semi: 0,
        "react/function-component-definition": "off",
        indent: "off",
        "max-len": "off",
        "comma-dangle": "off",
        "no-redeclare": "off",
        "react/jsx-indent": "off",
        "no-unused-vars": "off",

        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],

        "operator-linebreak": "off",
        "object-curly-newline": "off",
        "function-paren-newline": "off",
        "implicit-arrow-linebreak": "off",
        "nonblock-statement-body-position": "off",
        "react/jsx-one-expression-per-line": "off",
    },
}];