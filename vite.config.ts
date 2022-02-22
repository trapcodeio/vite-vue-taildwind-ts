import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {XpresserVitePlugin} from "./server/plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        XpresserVitePlugin((viteConfig) => {
            return {
                config: {
                    paths: {base: __dirname}
                },
                routes(router) {
                    router.get('/', () => "Hello World!");
                }
            }
        })
    ]
});
