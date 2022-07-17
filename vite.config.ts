import {defineConfig, UserConfig, BuildOptions} from 'vite';
import progress from 'vite-plugin-progress';

import virtualHtml from './config/plugins/vite-plugin-virtual-html';
import jsToJson from './config/plugins/vite-plugins-js-to-json';
import mergeSingleFile from './config/plugins/vite-plugin-merge-single-file';
import {shareConfig, getFullUrl} from './config/viteConfig/share';
import tplConfigFn from './config/viteConfig/tpl';

// 获取 manifest 文件
const manifestUrl = getFullUrl('src/manifest.ts');

// https://vitejs.dev/config/
export default defineConfig((evn) => {
    // console.log(1, evn);
    const {isDev, isNone, devData, proData, alias, plugins} = shareConfig(evn);
    const tplConfig = tplConfigFn(evn) as UserConfig;
    // if (isNone) {
    //     delete devData.watch;
    // }

    return {
        // css: {
        //     modules: false
        // },

        plugins: [
            ...plugins,
            progress(),
            virtualHtml({
                tplUrl: getFullUrl('index.html'),
                twoUrl: 'tpl',
                index: 'tagView',
            }),
            jsToJson(manifestUrl),
            mergeSingleFile(tplConfig),
        ],
        // css: {
        //     modules: {
        //         scopeBehaviour: 'local'
        //     }
        // },
        build: {
            ...(isDev || isNone) ? devData : proData,

            rollupOptions: {
                // external: ['vue'],
                input: {
                    // tag页面
                    // tagView: getFullUrl('tagView.html'),
                    // popup页面
                    popupView: getFullUrl('popupView.html'),

                    // 后台线程
                    serviceWorker: getFullUrl('src/serviceWorker/index.ts?merge'),
                    // 注入脚本
                    contentScripts: getFullUrl('src/contentScripts/split/index.ts?merge'),
                    contentScriptsTranslate: getFullUrl('src/contentScripts/translate/index.ts?merge'),
                    // 配置文件，没有什么效果，只是为了被监听到
                    // manifest: manifestUrl,
                },
                // 不要hash了，平铺出来
                output: [
                    {
                        assetFileNames: '[name].[ext]',
                        // 公共产物的 命名规则
                        chunkFileNames: 'chunk-[name].js',
                        // 入口文件的 命名规则
                        entryFileNames: '[name].js',
                        // inlineDynamicImports: true,
                        // globals: {
                        //     vue: 'Vue'
                        // }
                    },
                ]
            }
        },
        resolve: {
            alias,
        },
    };
});
