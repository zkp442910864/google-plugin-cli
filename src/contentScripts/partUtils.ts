import {Component, ComputedOptions, createApp, MethodOptions, DefineComponent} from 'vue';

import {chrome} from '@/utils';

export function createVueShadow (Component: DefineComponent<any, any, any, ComputedOptions, MethodOptions>, styleStr?: string | null) {
    const shadowBox = document.createElement('div');
    const shadow = shadowBox.attachShadow({mode: 'open'});

    const style = document.createElement('style');
    const divbox = document.createElement('div');

    styleStr && (style.textContent = styleStr);
    shadow.appendChild(style);
    shadow.appendChild(divbox);

    const app = createApp(Component);
    app.mount(divbox);
    document.body.appendChild(shadowBox);

    return shadow;
}

// 过滤不需要添加标识的标签
export const skipDom = (dom: HTMLElement) => {
    const name = dom.nodeName.toLocaleLowerCase();
    const data = [
        'SCRIPT', 'LINK', 'META', 'STYLE', 'symbol', 'path', '#comment', 'NOSCRIPT',
    ].map(ii => ii.toLocaleLowerCase());

    if (data.includes(name)) {
        return true;
    }

    if (name === '#text' && !(dom.nodeValue || '').replace(/\s+/, '')) {
        return true;
    }

    return false;
};

// 部分标签保留原样
export const skipRawDom = (dom: HTMLElement) => {
    const name = dom.nodeName.toLocaleLowerCase();
    const data = [
        'CODE',
    ].map(ii => ii.toLocaleLowerCase());

    if (data.includes(name)) {
        return true;
    }

    if (name === '#text' && !(dom.nodeValue || '').replace(/\s+/, '')) {
        return true;
    }

    return false;
};

export const sendMessage = (data: string[]) => {
    return new Promise<string[]>((rel) => {
        chrome.runtime.sendMessage(data, (response) => {
            rel(response);
        });
    });
};

