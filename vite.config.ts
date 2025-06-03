import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@icons': '/src/assets/icons',
            '@images': '/src/assets/images',
            '@components': '/src/components',
            '@styles': '/src/styles',
            '@utils': '/src/utils',
            '@typings': '/src/types',
        },
    },
});
