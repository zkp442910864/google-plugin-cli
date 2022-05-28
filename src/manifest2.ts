import type {Manifest} from 'webextension-polyfill';

const obj: Manifest.WebExtensionManifest = {
    // 清单文件版本 https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/
    manifest_version: 2,

    // 项目名称
    name: 'googlePlugin',

    // 描述文本
    description: '测试脚手架',

    // 版本号
    version: '1.0',


    // 后台脚本必须在清单中注册
    background: {
        scripts: [
            'serviceWoker.js'
        ],
        persistent: true,
    },

    // 添加相关功能权限
    permissions: [
        'storage',
        'activeTab',
        '<all_urls>',

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

    web_accessible_resources: [
        'tagView.html',
    ],

    browser_action: {
        default_title: '打开',
        default_popup: 'popupView.html',
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
            css: ['contentScripts.css'],
            all_frames: true,
            run_at: 'document_end'
        }
    ],
    // https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings
    // 火狐专用
    // applications: {
    //     gecko: {
    //         id: '7fa374f8fdb6c8455012eb4efde05910',
    //         strict_min_version: '42.0',
    //         // strict_max_version: '50.*',
    //         // update_url: 'https://example.com/updates.json'
    //     }
    // }
};

export default obj;