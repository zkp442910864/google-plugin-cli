import {PluginOption, normalizePath, build, UserConfig} from 'vite';
// import path from 'path';

/**
 * 给所有路由注入 js
 * @param injectData 需要注入的js
 * @returns
 */

export default function (injectData: string[]) {
    let mode = 'serve';
    let arrInput: {name: string, url: string, isHtml: boolean, htmlCode?: string}[] = [];
    const injectStr = injectData.map(str => `import '${normalizePath(str)}';`).join('\n');

    return {
        name: 'vite-plugin-inject',
        config (config, env) {
            // console.log(env.command);
            mode = env.mode;
            arrInput = [];
            // console.log(config);
        },
        buildStart (inputOptions) {
            for (const key in inputOptions.input) {
                let url = normalizePath(inputOptions.input[key]);
                url = url.replace('?merge', '');

                arrInput.push({
                    url,
                    isHtml: /.html$/.test(url),
                    name: key
                });
            }
        },
        load (id, options) {
            // if (id.indexOf('translate') > -1) {
            //     console.log(id, options);
            // }
        },
        transform (code, id) {
            const find = arrInput.find(ii => ii.url === id);

            if (find && find.isHtml) {
                const arr = code.match(/<script type="module" src="(.+)">/);
                if (!arr?.[1]) return;
                // console.log(process.cwd());
                const newUrl = normalizePath(process.cwd() + arr[1].replaceAll('/', '\\'));
                find.isHtml = false;
                find.url = newUrl;
                // find.htmlCode = code;
            } else if (find) {
                return {
                    code: `${injectStr}${code}`,
                    map: null,
                };
            }

            // if (id.indexOf('translate') > -1) {
            //     console.log(code, id);
            //     return {
            //         code: `${injectStr}${code}`,
            //         map: null,
            //     };
            // }
        },
        // moduleParsed (info) {
        //     // if (info.id.indexOf('translate') > -1) {
        //     //     console.log(info);
        //     // }
        // },
    };
}

