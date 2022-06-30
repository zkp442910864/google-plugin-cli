import type {Manifest} from 'webextension-polyfill';


const obj: Manifest.WebExtensionManifest = {
    // 项目名称
    name: '页面翻译对比',

    // 描述文本
    description: '中英文对比',

    // 版本号
    version: '1.0',

    // 清单文件版本 https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/
    manifest_version: 2,

    // https://developer.chrome.com/docs/extensions/mv3/service_workers/
    // 后台脚本必须在清单中注册
    background: {scripts: ['serviceWoker.js']},

    // 添加相关功能权限
    permissions: [
        'storage',
        // 'activeTab',


        // v2 使用的方式
        // https://developer.chrome.com/docs/extensions/reference/webRequest/
        // 使用chrome.webRequestAPI 来观察和分析流量并拦截、阻止或修改进行中的请求。
        'webRequest',
        'webRequestBlocking',

        // v3 使用的方式
        // https://developer.chrome.com/docs/extensions/reference/declarativeWebRequest/
        // https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/
        // 该chrome.declarativeNetRequestAPI用于阻挡或通过指定声明性规则修改网络请求。
        // 这允许扩展修改网络请求而无需拦截它们并查看其内容，从而提供更多隐私。
        // 'declarativeWebRequest',
        // 'declarativeNetRequest',


        // 定时触发
        // https://developer.chrome.com/docs/extensions/reference/alarms/#method-create
        // 'alarms',


        // 'scripting',
        // 'contextMenus',
        // '*://*/*',
        // 'http://*/*',
        // 'https://*/*',
        '<all_urls>'
    ],

    // host_permissions: [
    //     // '*://*/*',
    //     // 'http://*/*',
    //     // 'https://*/*',
    //     '<all_urls>'
    // ],

    // 多功能框 快捷操作，地址输入nt后，调出插件，再输入想要搜索的内容
    // omnibox: {keyword: 'nt'},

    // 覆盖 Chrome newTab 页面 https://developer.chrome.com/docs/extensions/mv3/override/
    // chrome_url_overrides: {
    //     newtab: 'tagView.html'
    // },

    // 用户操作界面, 必须在清单中声明
    browser_action: {
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
        16: 'icon-16.png',
        32: 'icon-32.png',
        48: 'icon-48.png',
        64: 'icon-64.png'
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
