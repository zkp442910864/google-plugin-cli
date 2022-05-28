
import * as ts from 'typescript';
import fs from 'fs';

/**
 * js 文件转 json  只支持简单格式的
 * @param {*} fileUrl 文件路径
 * @returns
 */
export default function (fileUrl) {
    return {
        name: 'vite-plugins-js-to-json',
        async generateBundle () {


            const content = fs.readFileSync(fileUrl).toString();

            // ts 转 js
            const {outputText} = ts.transpileModule(content, {
                compilerOptions: {
                    strict: false,
                    module: ts.ModuleKind.CommonJS,
                    target: ts.ScriptTarget.ES2015,
                }
            });

            const fn = new Function(`var exports={};${outputText}return exports`);
            const exportsData = fn();

            this.emitFile({
                type: 'asset',
                fileName: 'manifest.json',
                source: JSON.stringify(exportsData.default, null, 4)
            });
        }
    };
}
