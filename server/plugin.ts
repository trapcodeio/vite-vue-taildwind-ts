import {DollarSign} from "xpresser/types";
import {ResolvedConfig, Plugin} from "vite";

type XpresserRouter = import("@xpresser/router");

type XpresserConfig = {
    config: Record<string, any> & {
        name?: string;
        env?: string;
        paths: { base: string }
    },
    onInit?($: DollarSign): void | any;
    routes?(router: XpresserRouter): void | any;
}


export function XpresserVitePlugin(pluginConfig: XpresserConfig | ((viteConfig: ResolvedConfig) => XpresserConfig)): Plugin {
    let viteConfig: ResolvedConfig;

    return {
        name: 'xpresser',

        async configResolved(resolvedConfig) {
            viteConfig = resolvedConfig;

            // if (typeof config === 'function')  resolve it
            if (typeof pluginConfig === 'function') pluginConfig = pluginConfig(viteConfig);
            const {config, onInit, routes} = pluginConfig;

            // If no env is set, use vite one.
            if (!config.env) config.env = viteConfig.env.MODE;

            // Initialize xpresser with config
            const {init} = require('xpresser') as typeof import('xpresser');

            // Call init function
            const $ = init(config, {exposeDollarSign: true});

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