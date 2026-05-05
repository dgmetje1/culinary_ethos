import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    https: {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/config/routing/routes',
      generatedRouteTree: './src/config/routing/routeTree.gen.ts',
    }),
    react({
      jsxImportSource: '@emotion/react',
    }),
    babel({
      plugins: ['@emotion/babel-plugin'],
    }),
  ],
});
