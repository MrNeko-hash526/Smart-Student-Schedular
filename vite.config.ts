
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const react = (await import("@vitejs/plugin-react")).default;
const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;

const __dirname = dirname(fileURLToPath(import.meta.url));


export default async function viteConfig() {
  const plugins = [
    react({
      include: "**/*.{jsx,js}",
    }),
    runtimeErrorOverlay(),
  ];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const cartographer = (await import("@replit/vite-plugin-cartographer")).cartographer;
    plugins.push(cartographer());
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.[j]sx?$/,
      exclude: [],
    },
  };
}
