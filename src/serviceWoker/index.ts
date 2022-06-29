import '@/common';
import {chrome, getStorage} from '@/utils';
import {storageKey} from '@/config';

import {getTranslateLang} from './googleTranslateUtils';

const {CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION} = storageKey;


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


// 监听存储
(() => {
    const stopMap: {[key: string]: () => void} = {};
    chrome.storage.onChanged.addListener((changes) => {

        {
            const item = changes[CLOSE_X_FRAME_OPTIONS];
            const type = 'x-frame-options';
            if (item && item.newValue) {
                stopMap[type] = closeAssignHeader(type);
            } else {
                stopMap[type]?.();
            }
        }

        {
            const item = changes[CLOSE_CONTENT_SECURITY_POLICY];
            const type = 'content-security-policy';
            if (item && item.newValue) {
                stopMap[type] = closeAssignHeader(type);
            } else {
                stopMap[type]?.();
            }
        }
    });
})();

// 取消指定的响应头
function closeAssignHeader (name: 'x-frame-options' | 'content-security-policy') {

    const fn = (details: chrome.webRequest.WebResponseHeadersDetails) => {
        const headers = details.responseHeaders?.filter((item) => {

            // getStorage('close-x-frame-options');
            // getStorage('close-content-security-policy');
            if (name === item.name.toLocaleLowerCase()) {
                return false;
            }

            return true;
        });

        return {
            responseHeaders: headers
        };
    };

    chrome.webRequest.onHeadersReceived.addListener(fn, {urls: ['<all_urls>']}, ['blocking', 'responseHeaders']);

    return () => {
        chrome.webRequest.onHeadersReceived.removeListener(fn);
    };
}

