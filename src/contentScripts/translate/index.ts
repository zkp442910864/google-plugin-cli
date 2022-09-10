import {reactive, Ref, ref, toRaw, toRef, toRefs} from 'vue';

import {chrome} from '@/utils';

import {translationPage, createVueShadow, sendMessage} from '../partUtils';
import Box from './Box';
import {ISourceData} from './index.d';
import styleStr from './index.less';

const sourceData: Ref<ISourceData[]> = ref([]);
let appShadow: ReturnType<typeof createVueShadow>;
let topValue = 0;
let index = 0;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // console.log(request, sender, sendResponse);

    if (request.translate) {
        // 选择翻译 逻辑
        console.log('选择翻译', request);

        // 触发翻译，加dom逻辑
        const rawText = request.translateText;

        if (!rawText) return;

        // 追加翻译内容
        try {
            const resData = await sendMessage([rawText]);
            const rawData = toRaw(sourceData.value);
            // const rangeItem = window.getSelection()?.getRangeAt(0);
            // console.log(rangeItem!.commonAncestorContainer);

            rawData.forEach((item) => (item.last = false));
            rawData.push({
                // top: findNode(rangeItem!.commonAncestorContainer).getBoundingClientRect().top + getScrollTop(),
                top: topValue,
                rawText,
                // text: resData[0],
                textPromise: sendMessage([rawText]),
                last: true,
                index: index++,
            });

            // console.log(rawData);
            sourceData.value = rawData.slice();
        } catch (error) {
            console.error(error);
            return;
        }

        // 创建dom
        if (!appShadow) {
            appShadow = createVueShadow(Box, styleStr, {sourceData});
            // 取消overflow-hidden，会影响到 sticky
            // document.body.setAttribute('style', 'overflow:initial;');
        }
    } else if (request.translatePage) {
        // 整页翻译逻辑
        console.log('整页翻译', request);
        // 翻译页面
        translationPage(document.body);
    }

});


window.addEventListener('load', () => {
    const dom = document.body || document.documentElement;
    dom.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            // console.log(e.clientY);
            topValue = e.clientY + getScrollTop();
            // console.log('topValue', topValue);
        }
    });
});

/** 查找节点标签 */
function findNode (el: Node | HTMLElement | null): HTMLElement {

    if (!el) return document.createElement('div');

    if (el.nodeType === 1) {
        return el as HTMLElement;
    }

    return findNode(el.parentElement);
}

/** 获取滚动距离 */
const getScrollTop = () => {
    return document.documentElement.scrollTop || document.body.scrollTop;
};

const sleep = (timeout: number) => {
    return new Promise<void>((rel) => {
        setTimeout(() => {
            rel();
        }, timeout);
    });
};

