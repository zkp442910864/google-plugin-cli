/// <reference types="../../global" />

import {AliasOptions, PluginOption, BuildOptions, ConfigEnv, DepOptimizationOptions} from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

import vitePluginInject from '../plugins/vite-plugin-inject';

export const getFullUrl = (...arg) => {
    // process.cwd()
    // __dirname
    return path.resolve(process.cwd(), './', ...arg);
};

// 共享配置
export const shareConfig = (evn: ConfigEnv) => {

    const isPro = evn.mode === 'production';
    const isDev = evn.mode === 'development';
    const isNone = evn.mode === 'none';

    // 开发环境配置
    const devData: BuildOptions = {
        minify: false,
        sourcemap: true,
        reportCompressedSize: false,
        // watch: {
        //     clearScreen: true,
        //     include: [
        //         'src/**',
        //     ]
        // },
    };

    // 生产环境配置
    const proData: BuildOptions = {
        minify: 'terser',
        sourcemap: false,
        reportCompressedSize: false,
        terserOptions: {
            mangle: false,
            compress: false
        },
    };

    // 映射
    const alias: AliasOptions = {
        '@': getFullUrl('src'),
    };

    // 公共使用的插件
    const plugins: PluginOption = [
        vue({
            style: {
                // preprocessLang: 'less'
            },
            template: {},
            reactivityTransform: true,
        }),
        ViteComponents({
            customComponentResolvers: [AntDesignVueResolver()],
        }),
        vueJsx(),
        vitePluginInject([
            // 'webextension-polyfill',
            getFullUrl('src/common.ts'),
        ]),
    ];

    // const optimizeDeps: DepOptimizationOptions  ={
    //     include: [
    //         // '',
    //         getFullUrl('src/common.ts'),
    //     ],
    // };

    return {
        devData,
        proData,
        isDev,
        isNone,
        isPro,
        alias,
        plugins,
        // optimizeDeps,
    };

};


