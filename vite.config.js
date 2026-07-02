import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// `base: './'` makes every built asset path relative, which is what allows
// this project to be dropped into a GitHub Pages repo (project pages live at
// https://<user>.github.io/<repo>/ rather than the domain root) without any
// extra configuration.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
