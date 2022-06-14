import {defineConfig, normalizePath, BuildOptions, ConfigEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

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
    const devData = {
        minify: false,
        sourcemap: true,
        brotliSize: false,
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
        brotliSize: false,
        terserOptions: {
            mangle: false,
            compress: false
        },
    };

    // 映射
    const alias = {
        '@': getFullUrl('src'),
    };

    // 公共使用的插件
    const plugins = [
        vue({
            style: {
                preprocessLang: 'less'
            }
        }),
        ViteComponents({
            customComponentResolvers: [AntDesignVueResolver()],
        }),
        vueJsx(),
    ];

    return {
        devData,
        proData,
        isDev,
        isNone,
        isPro,
        alias,
        plugins,
    };

};


