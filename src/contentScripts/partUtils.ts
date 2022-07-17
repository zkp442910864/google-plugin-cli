import {Component, ComputedOptions, createApp, MethodOptions, DefineComponent} from 'vue';

import {chrome} from '@/utils';

export function createVueShadow (Component: DefineComponent<any, any, any, ComputedOptions, MethodOptions>, styleStr?: string | null, data?: Record<string, unknown>) {
    const shadowBox = document.createElement('div');
    const shadow = shadowBox.attachShadow({mode: 'open'});

    const style = document.createElement('style');
    const divBox = document.createElement('div');

    styleStr && (style.textContent = styleStr);
    shadow.appendChild(style);
    shadow.appendChild(divBox);

    const app = createApp(Component, data);
    app.mount(divBox);

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
        'PRE',
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

export const translationPage = async (body: HTMLElement) => {

    // 获取所有文本节点
    const handler = (list: HTMLElement[], arr: HTMLElement[]) => {
        list.forEach((dom) => {

            if (skipDom(dom) || skipRawDom(dom)) return;

            // if (isOneTextNode(dom)) {
            //     createDomClass(dom);
            //     return;
            // }
            if (dom.nodeType === 3) {
                arr.push(dom);
                return;
            }

            if (dom.childNodes.length) {
                handler([...dom.childNodes] as unknown as HTMLElement[], arr);
            }

        });
    };

    const textArr: HTMLElement[] = [];
    handler([...body.childNodes] as unknown as HTMLElement[], textArr);

    // console.log(textArr);
    const resData = await sendMessage(textArr.map(ii => ii.textContent || ''));

    // console.log(resData);
    textArr.forEach((dom, index) => {
        const newStr = resData[index];
        dom.textContent = newStr;
    });
};

