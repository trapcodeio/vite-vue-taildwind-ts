import {DollarSign} from "xpresser/types";
import {ResolvedConfig, Plugin} from "vite";
import {resolve} from "path";

type XpresserRouter = import("@xpresser/router");

type XpresserViteConfig = {
    configFile?: string;
    onInit?($: DollarSign): void | any;
    routes?(router: XpresserRouter): void | any;
}

type XpresserConfig = Record<string, any> & {
    name?: string;
    env?: string;
    paths: { base: string }
}


export function XpresserVitePlugin(
    // Plugin config or function that returns plugin config
    pluginConfig: XpresserViteConfig | ((viteConfig: ResolvedConfig) => XpresserViteConfig)
): Plugin {

    return {
        // Name of vite plugin
        name: 'xpresser',

        /**
         * On vite config resolved
         * Start xpresser server.
         * @param resolvedConfig
         */
        async configResolved(resolvedConfig) {
            const viteConfig = resolvedConfig;

            // if (typeof config === 'function')  resolve it
            if (typeof pluginConfig === 'function') pluginConfig = pluginConfig(viteConfig);

            // Destruct required values from plugin config
            const {configFile, onInit, routes} = pluginConfig;

            // Get xpresser config
            let config: XpresserConfig;

            // Try to require 'xpresser.config.js'
            try {
                config = require(configFile ? configFile : resolve('./xpresser.config.js')) as XpresserConfig;
            } catch (e) {
                throw e;
            }

            if (!config)
                throw new Error(`Xpresser config not found in file: ${configFile}`);

            // If no env is set, use vite one.
            if (!config.env) config.env = viteConfig.env.MODE;

            // Initialize xpresser with config
            const {init} = (require('xpresser') as typeof import('xpresser'));

            // Call init function
            const $ = init(config);

            // if `onInit` is a function in plugin config, call it
            if (typeof onInit === 'function')
                await onInit($);

            // if `routes` is a function in plugin config, call it passing router
            if (typeof routes === 'function')
                // Use $.on.boot because that is when $.router is available
                $.on.boot(async (n) => {
                    await routes($.router);
                    return n();
                })

            // Bootstrap xpresser
            $.boot();
        },
    }
}