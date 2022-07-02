import {BuildOptions, defineConfig, UserConfigFn} from 'vite';

import {shareConfig} from './share';

export default defineConfig((evn) => {
    const {isDev, isNone, devData, proData, alias, plugins} = shareConfig(evn);

    return {
        clearScreen: false,
        plugins: [
            ...plugins,
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
