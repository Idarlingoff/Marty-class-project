import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pour GitHub Pages : définir la base via variable d'environnement
const base = process.env.GITHUB_PAGES === 'true' ? '/marty-class-project/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) return 'router';
          if (id.includes('node_modules/@supabase')) return 'supabase';
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion';
        },
      },
    },
  },
})
