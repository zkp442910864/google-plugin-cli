import '@/common';
import {getTranslateLang} from './googleTranslateUtils';
import {chrome} from '@/utils';

chrome.runtime.onInstalled.addListener(() => {
    console.log('初始化');
});

// 接收页面信息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    getTranslateLang(request).then((res) => {
        sendResponse(res);
    });

    return true;
});


// chrome.getTranslateLang = getTranslateLang;
