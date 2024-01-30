// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), eslint()],
// });

import eslint from "vite-plugin-eslint";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    mainFields: [],
  },
});
