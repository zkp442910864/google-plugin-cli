import {reactive, Ref, ref} from 'vue';

import {chrome} from '@/utils';

import {translationPage, createVueShadow, sendMessage} from '../partUtils';
import Box from './Box';
import {IData} from './index.d';
import styleStr from './index.less';

let data: IData[];
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // console.log(request, sender, sendResponse);

    if (request.translate) {
        // 选择翻译
        console.log('选择翻译', request);

        // 触发翻译，加dom逻辑
        const rawText = request.translateText;

        if (!rawText) return;

        if (!data) {
            data = reactive([]);
            createVueShadow(Box, styleStr, {data});
        }

        const rangeItem = window.getSelection()?.getRangeAt(0);
        if (rangeItem) {
            const resData = await sendMessage([rawText]);
            data.push({
                top: findNode(rangeItem.commonAncestorContainer).getBoundingClientRect().top + document.documentElement.scrollTop,
                rawText,
                text: resData[0],
            });
        }
    } else if (request.translatePage) {
        // 整页翻译
        console.log('整页翻译', request);
        // 翻译页面
        translationPage(document.body);
    }

});


function findNode (el: Node | HTMLElement | null): HTMLElement {

    if (!el) return document.createElement('div');

    if (el.nodeType === 1) {
        return el as HTMLElement;
    }

    return findNode(el.parentElement);
}

