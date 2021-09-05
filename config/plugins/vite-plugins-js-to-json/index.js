
import fs from 'fs';

/**
 * js 文件转 json  只支持简单格式的
 * @param {*} fileUrl 文件路径
 * @returns
 */
export default function (fileUrl) {
    return {
        name: 'vite-plugins-js-to-json',
        generateBundle () {
            const content = fs.readFileSync(fileUrl).toString();
            const json = content.replace('export default', '').trim();

            const jsonData = new Function(`return ${json}`)();

            this.emitFile({
                type: 'asset',
                fileName: 'manifest.json',
                source: JSON.stringify(jsonData, null, 4)
            });
        }
    };
}
