import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@Assets": path.resolve(__dirname, "./src/assets"),
      "@Utils": path.resolve(__dirname, "./src/utils"),
      "@Store": path.resolve(__dirname, "./src/store"),
      "@Schemas": path.resolve(__dirname, "./src/schemas"),
      "@Hooks": path.resolve(__dirname, "./src/hooks"),
      "@Api": path.resolve(__dirname, "./src/api"),
      "@Services": path.resolve(__dirname, "./src/services"),
      "@Constants": path.resolve(__dirname, "./src/constants"),
      "@Queries": path.resolve(__dirname, "./src/api/queries"),
      "@Routes": path.resolve(__dirname, "./src/routes"),
      "@Views": path.resolve(__dirname, "./src/views"),
      "@Components": path.resolve(__dirname, "./src/components"),
      "@Validators": path.resolve(__dirname, "./src/validators"),
      "@Interceptors": path.resolve(__dirname, "./src/interceptors"),
    },
  },
  build: {
    sourcemap: true,
  },
});
