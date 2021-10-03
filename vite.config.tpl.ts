import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';
// import {nodeResolve} from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import {babel} from '@rollup/plugin-babel';


const getFullUrl = (...arg) => {
    // console.log(process.cwd());
    return path.resolve(process.cwd(), './', ...arg);
};

export default defineConfig((evn) => {
    const isDev = evn.mode === 'development';
    const isNone = evn.mode === 'none';

    const devData = {
        minify: false,
        sourcemap: true,
        brotliSize: false,
    };

    return {
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
            ...(isDev || isNone) ? devData : {},
            // 不清空dist
            emptyOutDir: false,

            rollupOptions: {
                // external: ['vue'],
                input: {
                    // contentScripts: getFullUrl('src/contentScripts/index.ts'),
                    templateKey: 'templateUrl',
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
            alias: {
                '@': getFullUrl('src'),
            }
        }
    };
});
