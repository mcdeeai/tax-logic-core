import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js', '**/*.mjs'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.node },
        },
        rules: {
            // Warn rather than error for now. Most remaining unused locals mark
            // logic that was started but never finished (e.g. AMT ignoring
            // filingStatus); docs/validation tracks them, and the fixes that
            // resolve them should raise this back to an error.
            'no-unused-vars': 'warn',
        },
    },
    {
        ignores: ['node_modules/', 'coverage/'],
    },
];
