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


export function XpresserVitePlugin(pluginConfig: XpresserViteConfig | ((viteConfig: ResolvedConfig) => XpresserViteConfig)): Plugin {
    let viteConfig: ResolvedConfig;

    return {
        name: 'xpresser',

        async configResolved(resolvedConfig) {
            viteConfig = resolvedConfig;

            // if (typeof config === 'function')  resolve it
            if (typeof pluginConfig === 'function') pluginConfig = pluginConfig(viteConfig);
            const {configFile, onInit, routes} = pluginConfig;

            let config: XpresserConfig;

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
            const {init} = require('xpresser') as typeof import('xpresser');

            // Call init function
            const $ = init(config);

            // if `onInit` is a function, call it
            if (typeof onInit === 'function')
                await onInit($);

            // if `routes` is a function, call it passing router
            if (typeof routes === 'function')
                $.on.boot(async (n) => {
                    await routes($.router);
                    return n();
                })

            // Bootstrap xpresser
            $.boot();
        },
    }
}