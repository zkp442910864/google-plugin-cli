import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import ViteComponents, {AntDesignVueResolver} from 'vite-plugin-components';

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
        ],
        build: {
            ...(isDev || isNone) ? devData : {},
            // 不清空dist
            emptyOutDir: false,
            cssCodeSplit: false,

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
                        chunkFileNames: 'chunk-[name].js',
                        // 入口文件的 命名规则
                        entryFileNames: '[name].js',
                        manualChunks: {},
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
