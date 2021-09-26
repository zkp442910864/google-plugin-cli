
export default {
    // 项目名称
    name: 'googlePlugin',

    // 描述文本
    description: '测试脚手架',

    // 版本号
    version: '1.0',

    // 清单文件版本 https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/
    manifest_version: 3,

    // https://developer.chrome.com/docs/extensions/mv3/service_workers/
    // 后台脚本必须在清单中注册
    background: {
        service_worker: 'serviceWoker.js',
        // google 版本需要91以上
        type: 'module',
    },

    // 添加相关功能权限
    permissions: [
        'storage',
        'activeTab',


        // v2 使用的方式
        // https://developer.chrome.com/docs/extensions/reference/webRequest/
        // 使用chrome.webRequestAPI 来观察和分析流量并拦截、阻止或修改进行中的请求。
        // 'webRequest',
        // 'webRequestBlocking',

        // v3 使用的方式
        // https://developer.chrome.com/docs/extensions/reference/declarativeWebRequest/
        // https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/
        // 该chrome.declarativeNetRequestAPI用于阻挡或通过指定声明性规则修改网络请求。
        // 这允许扩展修改网络请求而无需拦截它们并查看其内容，从而提供更多隐私。
        // 'declarativeWebRequest',
        // 'declarativeNetRequest',


        // 定时触发
        // https://developer.chrome.com/docs/extensions/reference/alarms/#method-create
        'alarms',


        // 'scripting',
        // 'contextMenus',
        // '*://*/*',
        // 'http://*/*',
        // 'https://*/*',
    ],

    host_permissions: [
        // '*://*/*',
        // 'http://*/*',
        // 'https://*/*',
        '<all_urls>'
    ],

    // 多功能框 快捷操作，地址输入nt后，调出插件，再输入想要搜索的内容
    // omnibox: {keyword: 'nt'},

    // 覆盖 Chrome newTab 页面 https://developer.chrome.com/docs/extensions/mv3/override/
    // chrome_url_overrides: {
    //     newtab: 'tagView.html'
    // },

    // 用户操作界面, 必须在清单中声明
    action: {
        // default_title: '打开采集页面',
        default_popup: 'popupView.html',
        // "default_icon": {
        //     "16": "/images/get_started16.png",
        //     "32": "/images/get_started32.png",
        //     "48": "/images/get_started48.png",
        //     "128": "/images/get_started128.png"
        // }
    },

    // 插件图标
    icons: {
        16: 'test-16.png',
        32: 'test-32.png',
        48: 'test-48.png',
        64: 'test-64.png'
    },

    // 配置项页面
    // options_page: 'tagView.html',

    // web_accessible_resources: [
    //     {
    //         resources: ['*'],
    //         matches: [
    //             '*.irobotbox.com',
    //         ]
    //     }
    // ],

    // 注入脚本
    // https://developer.chrome.com/docs/extensions/mv3/content_scripts/
    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ['contentScripts.js'],
            all_frames: true
        }
    ]
};
