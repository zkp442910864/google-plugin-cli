# Vue 3 + Typescript + Vite

- [vitesse-webext 插件脚手架](https://github.com/zkp442910864/vitesse-webext/tree/main/src)
- [webextension-polyfill 兼容](https://github.com/mozilla/webextension-polyfill/)
- [crx 打包库](https://www.npmjs.com/package/crx)
- [crx3 打包库](https://www.npmjs.com/package/crx3)
- [web-ext 调试/打包](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#commands)
- [火狐打包签名方式1](https://addons-server.readthedocs.io/en/latest/topics/api/signing.html)
- [火狐打包签名方式2](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#Signing_your_extension_for_distribution)
- [火狐打包签名 接口文档](https://addons-server.readthedocs.io/en/latest/topics/api/signing.html#client-libraries)
- [firefox 插件开发文档](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/s)
- [chrome 插件开发文档](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [ts compiler api](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [vue jsx/tsx](https://github.com/vuejs/babel-plugin-jsx/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md)

### 命令

```bash
    # 调试 chrome
    npm run dev:chrome

    # 调试 firefox
    npm run dev:firefox

    # 打包所有（不包含火狐签名版本
    npm run build

    # 打包火狐（签名版本
    npm run sign:ff

    # 输出web文件
    npm run build:web

    # 使用crx 和crx3 进行打包，不明白有啥区别
    npm run build:crx3
    npm run build:crx2
    npm run build:zip2

    # 打包火狐（未签名版本
    npm run build:ff
```

### 注意点

#### vite.config.ts 页面，js都在这里面进行配置

- 添加文件 build.rollupOptions.input
  - html: {tagView: getFullUrl('tagView.html')}
    - 需要创建对应的文件 src/tagView/main.ts
  - js: {serviceWoker: getFullUrl('src/serviceWoker/index.ts?merge')}
    - 带 ?merge 会把js生成为一个文件，比较耗时
- vite.config.ts 切换 manifest 文件

### 修改后的脚手架，用来开发谷歌插件

> 脚手架搭建参考 <https://github.com/geeeger-pkgs/vite-multi-page-template>

入门 <https://developer.chrome.com/docs/extensions/mv3/getstarted/>
扩展开发概述 <https://developer.chrome.com/docs/extensions/mv3/devguide/>
架构概览 <https://developer.chrome.com/docs/extensions/mv3/architecture-overview/>
声明权限 <https://developer.chrome.com/docs/extensions/mv3/declare_permissions/>

> 获取配置清单 chrome.runtime.getManifest() <br>

### 功能权限

- storage       存储权限
    > <https://developer.chrome.com/docs/extensions/reference/storage/>
- contextMenus  上下文菜单(右键菜单)
    > <https://developer.chrome.com/docs/extensions/reference/contextMenus/>
- activeTab     操作页面权限
    > <https://developer.chrome.com/docs/extensions/mv3/manifest/activeTab/>
- webRequest    观察和分析流量并拦截、阻止或修改进行中的请求。
    > <https://developer.chrome.com/docs/extensions/reference/webRequest/>
- scripting     当前页面的js操作权限

### 后台脚本

- chrome.runtime.onInstalled 初始化事件
    > 在首次安装扩展程序、将扩展程序更新到新版本以及 Chrome 更新到新版本时触发。 <br>
    <https://developer.chrome.com/docs/extensions/reference/runtime/#event-onInstalled>

    ```js
    // 应该是做一些初始化操作的
    chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.set({ color });
        console.log('Default background color set to %cgreen', `color: ${color}`);
    });
    ```

### 用户操作界面

- default_popup 右上角弹出窗口(html文件)
- default_icon 右上角小图标, 如果没有会取 icons 的值
- default_title 右上角悬浮提示文本
    > 动态设置 chrome.action.setTitle({title: 'eeee'}) <br>
    <https://developer.chrome.com/docs/extensions/reference/action/#method-setTitle>

### 国际化

- default_locale 配置默认语言
- api
    > chrome.i18n.getUILanguage() 获取用户界面的语言
- 目录下新增
    > _locales/语言/messages.json <br>
    > 文档：<https://developer.chrome.com/docs/extensions/reference/i18n/> <br>
    > demo: <https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/mv2-archive/extensions/news>

### 多功能框

- omnibox 功能
    > <https://developer.chrome.com/docs/extensions/mv3/user_interface/#omnibox>

### 上下文菜单(右键菜单)

- 菜单内容创建
    > api

    ```js
    chrome.contextMenus.create({
        id: key,
        title: kLocales[key],
        type: 'normal',
        // 触发机制包括
        contexts: ['selection'],
    });
    ```

### 代码注入/执行 (操作当前激活的tab页面)

- content_scripts 限制脚本的执行范围
- 以编程方式注入的内容脚本
- api
    > chrome.scripting.executeScript 执行脚本<br>
    > chrome.scripting.insertCSS 注入css<br>
    > chrome.scripting.removeCSS 删除注入css<br>
    > <https://developer.chrome.com/docs/extensions/mv3/content_scripts/#programmatic> <br>
    > <https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript> <br>

    ```js
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        // 当前激活的tab页面
        target: { tabId: tab.id },
        // 执行代码逻辑
        function: setPageBackgroundColor,
    });
    ```
