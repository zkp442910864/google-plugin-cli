import {chrome} from '@/utils';

import {translationPage} from '../partUtils';


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log(request, sender, sendResponse);

    if (request.translate) {
        // 选择翻译
        console.log('选择翻译', request);

        // 触发翻译，加dom逻辑
        console.log(window.getSelection()?.getRangeAt(0));
    } else if (request.translatePage) {
        // 整页翻译
        console.log('整页翻译', request);
        // 翻译页面
        translationPage(document.body);
    }

});


