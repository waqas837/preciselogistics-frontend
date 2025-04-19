import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'stream', 'util', 'process']
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "My PWA App",
        short_name: "PWA App",
        description: "My Progressive Web Application",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
      // Remove aws-sdk alias as we're using v3 modules
    },
  },
  define: {
    global: 'window',
    'process.env': {},
    __filename: '"browser-only"',
    __dirname: '"browser-only"',
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
  }
});