import {PluginOption, normalizePath} from 'vite';
import {exec} from 'child_process';
import fs from 'fs';

/**
 * 逻辑：
 * 主要根据主文件上input 上的路径包含 ?merge 进行处理
 * TODO: 这个操作很耗时间
 *
 * 1.读取vite.config.ts 模板，替换input 里的key 和name
 * 2.模板的 output.manualChunks 要重置下，不然node_modules 的内容会被提取出来
 * 3.然后生成一个新的vite.config.ts 到node_modules 里
 * 4.最后在执行命令 vite build -c
 * @param tplUrl 模板路径
 * @returns
 */

export default function (tplUrl) {
    let mode = 'serve';
    const arrInput = [];

    // 执行命令
    const runCli = (str) => {
        return new Promise((rel, rej) => {
            exec(str, (err, stdout, stderr) => {
                // console.log(stdout);
                if (err) {
                    console.error(err);
                    rej(err);
                } else {
                    rel(stdout);
                }
                // console.log(err, stdout, stderr);
            });
        });
    };

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
        generateBundle () {
            (async () => {
                const tplStrRaw = fs.readFileSync(tplUrl).toString();
                const fileUrl = `${process.cwd()}/node_modules/vite.config.ts`;

                for (const item of arrInput) {
                    let tplStr = tplStrRaw.replace('templateKey', item.name);
                    tplStr = tplStr.replace('templateUrl', item.url);

                    fs.writeFileSync(fileUrl, tplStr);
                    await runCli(`vite -c ${fileUrl} build -m ${mode}`);
                }

                fs.unlink(fileUrl, () => {});
            })();
            // runCli('vite -c ./config/vite.config.tpl.ts build -m none');
        }
    } as PluginOption;
}
