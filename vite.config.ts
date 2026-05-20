import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pour GitHub Pages : définir la base via variable d'environnement
const base = process.env.GITHUB_PAGES === 'true' ? '/marty-class-project/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
