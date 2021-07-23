const { join } = require('path');

const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');

module.exports = {
    presets: [require('../../tailwind-workspace-preset.js')],
    mode: 'jit',
    purge: [
        join(__dirname, 'pages/**/*.{js,ts,jsx,tsx}'),
        ...createGlobPatternsForDependencies(__dirname),
    ],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: []
};