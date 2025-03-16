// vite.config.ts
import { defineConfig } from "file:///D:/work/Dr.ahmed%20Rabie/QMS/node_modules/vite/dist/node/index.js";
import react from "file:///D:/work/Dr.ahmed%20Rabie/QMS/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///D:/work/Dr.ahmed%20Rabie/QMS/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "D:\\work\\Dr.ahmed Rabie\\QMS";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-tsx",
          setup(build) {
            build.onLoad(
              { filter: /src\\.*\.js$/ },
              async (args) => ({
                loader: "tsx",
                contents: await fs.readFile(args.path, "utf8")
              })
            );
          }
        }
      ]
    }
  },
  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],
  plugins: [svgr(), react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrXFxcXERyLmFobWVkIFJhYmllXFxcXFFNU1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcd29ya1xcXFxEci5haG1lZCBSYWJpZVxcXFxRTVNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3dvcmsvRHIuYWhtZWQlMjBSYWJpZS9RTVMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgc3ZnciBmcm9tICdAc3Znci9yb2xsdXAnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICBzcmM6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgbG9hZGVyOiAndHN4JyxcclxuICAgICAgICBpbmNsdWRlOiAvc3JjXFwvLipcXC50c3g/JC8sXHJcbiAgICAgICAgZXhjbHVkZTogW10sXHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdsb2FkLWpzLWZpbGVzLWFzLXRzeCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dXAoYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGQub25Mb2FkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBmaWx0ZXI6IC9zcmNcXFxcLipcXC5qcyQvIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoYXJncykgPT4gKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXI6ICd0c3gnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBhd2FpdCBmcy5yZWFkRmlsZShhcmdzLnBhdGgsICd1dGY4JyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBcclxuICAgIC8vIHBsdWdpbnM6IFtyZWFjdCgpLHN2Z3Ioe1xyXG4gICAgLy8gICBleHBvcnRBc0RlZmF1bHQ6IHRydWVcclxuICAgIC8vIH0pXSxcclxuXHJcbiAgICBwbHVnaW5zOiBbc3ZncigpLCByZWFjdCgpXSxcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUSxTQUFTLG9CQUFvQjtBQUN2UyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ2pDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLElBQ1QsU0FBUyxDQUFDO0FBQUEsRUFDZDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDTDtBQUFBLFVBQ0ksTUFBTTtBQUFBLFVBQ04sTUFBTSxPQUFPO0FBQ1Qsa0JBQU07QUFBQSxjQUNGLEVBQUUsUUFBUSxlQUFlO0FBQUEsY0FDekIsT0FBTyxVQUFVO0FBQUEsZ0JBQ2IsUUFBUTtBQUFBLGdCQUNSLFVBQVUsTUFBTSxHQUFHLFNBQVMsS0FBSyxNQUFNLE1BQU07QUFBQSxjQUNqRDtBQUFBLFlBQ0o7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUUEsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDN0IsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
