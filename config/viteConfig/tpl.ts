import {BuildOptions, defineConfig, UserConfigFn} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';

import {shareConfig} from './share';


export default defineConfig((evn) => {
    const {isDev, isNone, devData, proData, alias} = shareConfig(evn);

    return {
        clearScreen: false,
        plugins: [
            vue(),
            ViteComponents({
                customComponentResolvers: [AntDesignVueResolver()],
            }),
            // nodeResolve({
            //     browser: true
            // }),
            // commonjs(),
            // babel({babelHelpers: 'bundled'}),
            // typescript(),
        ],
        build: {
            ...(isDev || isNone) ? devData : proData,
            // 不清空dist
            emptyOutDir: false,

            rollupOptions: {
                // external: ['vue'],
                input: {
                    // contentScripts: getFullUrl('src/contentScripts/index.ts'),
                    // templateKey: 'templateUrl',
                },
                output: [
                    {
                        assetFileNames: '[name].[ext]',
                        // 公共产物的 命名规则
                        // chunkFileNames: 'chunk-[name].js',
                        // 入口文件的 命名规则
                        entryFileNames: '[name].js',
                        manualChunks: undefined,
                        // inlineDynamicImports: true,
                        // format: 'umd'
                        plugins: [
                            // nodeResolve({
                            //     browser: true
                            // }),
                            // commonjs(),
                            // babel({babelHelpers: 'bundled'}),
                        ]
                    },
                ]
            }
        },
        resolve: {
            alias
        }
    };
}) as UserConfigFn;
