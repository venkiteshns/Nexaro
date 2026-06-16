import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-console': 'off',
            'no-undef': 'error',
            'eqeqeq': ['error', 'always'],

            'no-var': 'error',
            'prefer-const': 'warn',
            'object-shorthand': 'warn',
            'no-duplicate-imports': 'error',

            'no-async-promise-executor': 'error',
            'no-await-in-loop': 'warn',
            'require-await': 'warn',
        },
        ignores: ['node_modules/**'],
    },
];
