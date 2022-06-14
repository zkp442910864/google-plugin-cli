import {defineConfig, UserConfig, BuildOptions} from 'vite';
// import {rollup} from 'rollup';
// import loadConfigFile from 'rollup/dist/loadConfigFile';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';
// import {babel} from '@rollup/plugin-babel';
// import commonjs from '@rollup/plugin-commonjs';
// import buble from '@rollup/plugin-buble';
// import legacy, {cspHashes} from '@vitejs/plugin-legacy';
// import dataUri from '@rollup/plugin-data-uri';
// import inject from '@rollup/plugin-inject';
// import usePluginImport from 'vite-plugin-importer';
// import {nodeResolve} from '@rollup/plugin-node-resolve';
// import json from '@rollup/plugin-json';
// import typescript from '@rollup/plugin-typescript';
// import fs from 'fs';
// import {exec} from 'child_process';
// import vitePluginImp from 'vite-plugin-imp';
import virtualHtml from './config/plugins/vite-plugin-virtual-html';
import jsToJson from './config/plugins/vite-plugins-js-to-json';
import mergeSingleFile from './config/plugins/vite-plugin-merge-single-file';

import {shareConfig, getFullUrl} from './config/viteConfig/share';
import tplConfigFn from './config/viteConfig/tpl';

// 获取 manifest 文件
const manifestUrl = getFullUrl('src/manifest2.ts');

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
            // vue({
            //     style: {
            //         preprocessLang: 'less'
            //     }
            // }),
            // ViteComponents({
            //     customComponentResolvers: [AntDesignVueResolver()],
            // }),
            // vitePluginImp({
            //     libList: [
            //         {
            //             libName: 'ant-design-vue',
            //             style (name) {
            //                 if (/popconfirm/.test(name)) {
            //                     // support multiple style file path to import
            //                     return [
            //                         'ant-design-vue/es/button/style/index.css',
            //                         'ant-design-vue/es/popover/style/index.css'
            //                     ];
            //                 }
            //                 return `ant-design-vue/es/${name}/style/index.css`;
            //             }
            //         },
            //     ],
            // }),
            virtualHtml({
                tplUrl: getFullUrl('index.html'),
                twoUrl: 'tpl',
                index: 'tagView',
            }),
            jsToJson(manifestUrl),
            // mergeSingleFile(getFullUrl('vite.config.tpl.ts')),
            mergeSingleFile(tplConfig),

            // {
            //     name: 'test',
            //     generateBundle (options, bundle) {
            //         console.log(options);
            //     }
            // }
        ],
        // css: {
        //     modules: {
        //         scopeBehaviour: 'local'
        //     }
        // },
        build: {
            ...(isDev || isNone) ? devData : proData,

            // cssCodeSplit: true,

            // target: 'chrome',
            rollupOptions: {
                // external: ['vue'],
                input: {
                    // tag页面
                    tagView: getFullUrl('tagView.html'),
                    // popup页面
                    popupView: getFullUrl('popupView.html'),

                    // 后台线程
                    serviceWoker: getFullUrl('src/serviceWoker/index.ts?merge'),
                    // 注入脚本
                    contentScripts: getFullUrl('src/contentScripts/index.ts?merge'),
                    // 配置文件，没有什么效果，只是为了被监听到
                    manifest: manifestUrl,
                },
                // treeshake: false,
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
        }
    };
});
