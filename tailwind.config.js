import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: 'var(--brand-color, #4f46e5)', // Default to indigo-600
                'brand-light': 'var(--brand-light, #6366f1)', // Default to indigo-500
                'brand-dark': 'var(--brand-dark, #4338ca)', // Default to indigo-700
            }
        },
    },

    plugins: [forms],
};
