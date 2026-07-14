import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    server: {
        port: 3000,
        host: true // sets host to 0.0.0.0
    }
});