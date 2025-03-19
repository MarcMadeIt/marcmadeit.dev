import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["quill"], // 🛠️ Sørger for at Quill håndteres korrekt
    },
  },
});