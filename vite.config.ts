import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {XpresserVitePlugin} from "./server/plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        XpresserVitePlugin(() => {
            return {
                onInit($) {
                    $.logSuccess('Xpresser Vite Plugin Initialized');
                },
                routes(r) {
                    r.get('/', () => "Hello World!");
                }
            }
        }),
    ]
});
