
const params = {
    // 输出详细信息
    verbose: false,
    // 签名，如果刚申请的失败，可能等一晚再试就成功了
    // 版本号不能重复
    sign: {
        // 火狐开发者中心那生成 https://addons.mozilla.org/zh-CN/developers/addon/api/key/
        apiKey: '...',
        apiSecret: '...',
        // 需要先在火狐开发者中心上传插件，再复制过来
        id: '{c0d6a377-d528-4eee-977e-d30a0a3c0fcf}',
        // listed 发布到平台上 unlisted 不发布平台
        channel: 'unlisted',
        apiUrlPrefix: 'https://addons.mozilla.org/api/v5',
    },
    // 打包
    build: {
        overwriteDest: true,
    },
    // 输出文件夹
    artifactsDir: './build',
    // 资源文件
    sourceDir: './dist',
};

module.exports = params;

