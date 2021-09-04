import {send, normalizePath} from 'vite'
import fs from 'fs';

/**
 * 虚拟html
 *
 * 拦截所有 html 的请求
 *
 * 加载模板文件
 *
 * 然后根据 html文件名，替换默认引入的js路径(这里默认的 /src/serviceWoker/main.ts)
 *
 * @param {*} param0.tplUrl 模板路径
 * @param {*} param0.twoUrl 模板中js 默认路径中的 二级目录
 * @param {*} param0.index 设置主页 index
 * @returns
 */
export default function ({tplUrl, twoUrl, index}) {
    let command = 'serve';

    const getHtml = (url, replaceArr, isLine = false, defaultUrl = '') => {
        const [before, after] = replaceArr;
        let html = fs.readFileSync(url).toString();
        html = html.replace(before, isLine ? defaultUrl : after);
        // console.log(html);

        return html;
    }

    return {
        name: 'vite-plugin-virtual-html',
        config (config, env) {
            // console.log(env.command);
            command = env.command;
        },
        configureServer (server) {
            if (command === 'serve') {
                server.middlewares.use((req, res, next) => {
                    const url = req.url || '';
                    const isLine = url === '/';
                    // const urlArr = url.split('.');

                    if (~url.indexOf('.html') || isLine) {
                        const urls = url.split('/');
                        const after = urls[urls.length - 1].split('.')[0];
                        const html = getHtml(tplUrl, [twoUrl, after], isLine, index);
                        send(req, res, html, 'html');
                    } else {
                        next()
                    }
                })
            }
        },
        resolveId (id) {
            // console.log(id);
            if (command === 'build' && ~id.indexOf('.html')) {
                // 解析路径，必须使用 vite normalizePath 把路径转换成正确路径
                return normalizePath(id);
            }
        },
        load (id) {
            if (command === 'build' && ~id.indexOf('.html')) {
                const after = id.match('(\|/)([a-zA-Z]+).html')[2];

                return getHtml(tplUrl, [twoUrl, after]);
            }
        },
        // generateBundle (output, build) {
        //     console.log(1)
        // }
    }
}
