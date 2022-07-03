import {chrome} from '@/utils';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log(request, sender, sendResponse);
    if (!request.translate) return;

    console.log(request.translateText);

    // 触发翻译，加dom逻辑
    console.log(window.getSelection()?.getRangeAt(0));
});


