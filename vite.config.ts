import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';
// import fs from 'fs';
import virtualHtml from './config/plugins/vite-plugin-virtual-html';
import jsToJson from './config/plugins/vite-plugins-js-to-json';
// console.log(fs);

const getFullUrl = (...arg) => {
    return path.resolve(__dirname, ...arg);
};


// https://vitejs.dev/config/
export default defineConfig((evn) => {
    // console.log(1, evn.mode);
    const isDev = evn.mode === 'development';

    const devData = {
        minify: false,
        sourcemap: true,
        brotliSize: false,
        watch: {
            clearScreen: true,
            include: [
                'src/**/*',
            ]
        },
    };

    return {
        plugins: [
            vue(),
            ViteComponents({
                customComponentResolvers: [AntDesignVueResolver()],
            }),
            virtualHtml({
                tplUrl: getFullUrl('index.html'),
                twoUrl: 'tpl',
                index: 'tagView',
            }),
            jsToJson(getFullUrl('src/manifest.ts')),

            // {
            //     name: 'test',
            //     generateBundle (options, bundle) {
            //         console.log(options);
            //     }
            // }
        ],
        build: {
            ...isDev ? devData : {},

            rollupOptions: {
                input: {
                    // tag页面
                    tagView: getFullUrl('tagView.html'),
                    // popup页面
                    popupView: getFullUrl('popupView.html'),

                    // 主线程
                    serviceWoker: getFullUrl('src/serviceWoker/index.ts'),
                    // 配置文件，没有什么效果，只是为了被监听到
                    manifest: getFullUrl('src/manifest.ts'),
                },
                // 不要hash了，平铺出来
                output: {
                    assetFileNames: '[name].[ext]',
                    chunkFileNames: '[name].js',
                    entryFileNames: '[name].js',
                }
            }
        },
        resolve: {
            alias: {
                '@': getFullUrl('src'),
            }
        }
    };
});
