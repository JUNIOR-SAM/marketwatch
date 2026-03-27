import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Using './' (Relative Path) allows the app to work on GitHub (/marketwatch/) 
  // and Vercel (root /) without changing the code every time.
  base: './', 
})
