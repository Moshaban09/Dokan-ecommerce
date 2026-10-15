import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge')) return 'ui';
            // Match exact package directories only (avoids catching e.g. react-hook-form or react-i18next)
            if (/[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/.test(id)) return 'vendor';
            return 'vendor';
          }
        }
      }
    }
  }
});
