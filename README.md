# Vue 3 + Typescript + Vite

### 修改后的脚手架，用来开发谷歌插件
> 脚手架搭建参考 https://github.com/geeeger-pkgs/vite-multi-page-template

入门 https://developer.chrome.com/docs/extensions/mv3/getstarted/
扩展开发概述 https://developer.chrome.com/docs/extensions/mv3/devguide/
架构概览 https://developer.chrome.com/docs/extensions/mv3/architecture-overview/
声明权限 https://developer.chrome.com/docs/extensions/mv3/declare_permissions/


### manifest.json 清单文件
```
{
    // 项目名称
    "name": "Getting Started Example",

    // 描述文本
    "description": "Build an Extension!",

    // 版本号
    "version": "1.0",

    // 清单文件版本 https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/
    "manifest_version": 3,

    // 后台脚本必须在清单中注册
    "background": {
        "service_worker": "background.js"
    },

    // 添加相关功能权限
    "permissions": ["storage", "activeTab", "scripting", "contextMenus"],

    // 多功能框 快捷操作，地址输入nt后，调出插件，再输入想要搜索的内容
    "omnibox": {"keyword" : "nt"},

    // 覆盖 Chrome newTab 页面 https://developer.chrome.com/docs/extensions/mv3/override/
    "chrome_url_overrides" : {
        "newtab": "popup.html"
    },

    // 用户操作界面, 必须在清单中声明
    "action": {
        "default_popup": "popup.html",
        "default_icon": {
            "16": "/images/get_started16.png",
            "32": "/images/get_started32.png",
            "48": "/images/get_started48.png",
            "128": "/images/get_started128.png"
        }
    },

    // 插件图标
    "icons": {
        "16": "/images/get_started16.png",
        "32": "/images/get_started32.png",
        "48": "/images/get_started48.png",
        "128": "/images/get_started128.png"
    },

    // 配置项页面
    "options_page": "options.html"
}
```


### 功能权限
* storage       存储权限
    > https://developer.chrome.com/docs/extensions/reference/storage/
* contextMenus  上下文菜单(右键菜单)
    > https://developer.chrome.com/docs/extensions/reference/contextMenus/
* activeTab     操作页面权限
    > https://developer.chrome.com/docs/extensions/mv3/manifest/activeTab/
* webRequest    观察和分析流量并拦截、阻止或修改进行中的请求。
    > https://developer.chrome.com/docs/extensions/reference/webRequest/
* scripting     当前页面的js操作权限


### 后台脚本
* chrome.runtime.onInstalled 初始化事件
    > 在首次安装扩展程序、将扩展程序更新到新版本以及 Chrome 更新到新版本时触发。 <br>
    https://developer.chrome.com/docs/extensions/reference/runtime/#event-onInstalled

    ```
    // 应该是做一些初始化操作的
    chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.set({ color });
        console.log('Default background color set to %cgreen', `color: ${color}`);
    });
    ```


### 用户操作界面
* default_popup 右上角弹出窗口(html文件)
* default_icon 右上角小图标, 如果没有会取 icons 的值
* default_title 右上角悬浮提示文本
    > 动态设置 chrome.action.setTitle({title: 'eeee'}) <br>
    https://developer.chrome.com/docs/extensions/reference/action/#method-setTitle


### 国际化
* default_locale 配置默认语言
* api
    > chrome.i18n.getUILanguage() 获取用户界面的语言
* 目录下新增
    > _locales/语言/messages.json <br>
    > 文档：https://developer.chrome.com/docs/extensions/reference/i18n/ <br>
    > demo: https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/extensions/news


### 多功能框
* omnibox 功能
    > https://developer.chrome.com/docs/extensions/mv3/user_interface/#omnibox


### 上下文菜单(右键菜单)
* 菜单内容创建
    > api
    ```
    chrome.contextMenus.create({
        id: key,
        title: kLocales[key],
        type: 'normal',
        // 触发机制包括
        contexts: ['selection'],
    });
    ```


### 代码注入/执行 (操作当前激活的tab页面)
* content_scripts 限制脚本的执行范围
* 以编程方式注入的内容脚本
* api
    > chrome.scripting.executeScript 执行脚本<br>
    > chrome.scripting.insertCSS 注入css<br>
    > chrome.scripting.removeCSS 删除注入css<br>
    > https://developer.chrome.com/docs/extensions/mv3/content_scripts/#programmatic <br>
    > https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript <br>
    ```
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        // 当前激活的tab页面
        target: { tabId: tab.id },
        // 执行代码逻辑
        function: setPageBackgroundColor,
    });
    ```
