import {PluginOption, normalizePath, build, UserConfig} from 'vite';
import {exec} from 'child_process';
import fs from 'fs';

/**
 * 逻辑：
 * 主要根据主文件上input 上的路径包含 ?merge 进行处理
 * TODO: 这个操作很耗时间
 *
 * 1.获取配置
 * 2.模板的 output.manualChunks 要重置下，不然node_modules 的内容会被提取出来
 * 3.然后执行 build 函数，注意属性 configFile 要置为false，不然会自动读取目录下的vite.config.ts
 * @param tplConfig 提供个模板配置
 * @returns
 */

export default function (tplConfig: UserConfig) {
    let mode = 'serve';
    const arrInput: {name: string, url: string}[] = [];

    return {
        name: 'vite-plugin-merge-single-file',
        config (config, env) {
            // console.log(env.command);
            mode = env.mode;
        },
        buildStart (inputOptions) {
            for (const key in inputOptions.input) {
                const url = inputOptions.input[key];
                if (~url.indexOf('?merge')) {
                    delete inputOptions.input[key];
                    arrInput.push({
                        url: normalizePath(url).replace('?merge', ''),
                        name: key
                    });
                }
            }
        },
        async renderStart () {
            for (const item of arrInput) {

                tplConfig!.build!.rollupOptions!.input = {
                    [item.name]: item.url,
                };

                await build({
                    mode,
                    configFile: false,
                    ...tplConfig,
                });
            }
        }
    } as PluginOption;
}
