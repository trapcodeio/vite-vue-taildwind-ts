import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {XpresserVitePlugin} from "./server/plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        XpresserVitePlugin(() => {
            return {
                plugins() {
                    return {
                        // "npm://@xpresser/ngrok": true
                    }
                },
                routes(r) {
                    r.get('/', () => "Hello World!");
                }
            }
        }),
    ]
});
