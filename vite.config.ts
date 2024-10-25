import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: ['./src/App.svelte'],
            fileName: 'svelte-life-game.js',
            formats: ['es'],
        },
    },
    plugins: [
        svelte({
            compilerOptions: {
                customElement: true,
            },
        }),
    ],
});
