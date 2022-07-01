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
    chrome.storage.onChanged.addListener((changes) => {
        Reflect.has(changes, CLOSE_X_FRAME_OPTIONS) && closeAssignHeader(!!changes[CLOSE_X_FRAME_OPTIONS]?.newValue, 'x-frame-options');
        Reflect.has(changes, CLOSE_CONTENT_SECURITY_POLICY) && closeAssignHeader(!!changes[CLOSE_CONTENT_SECURITY_POLICY]?.newValue, 'content-security-policy');

    });
})();

// 初始化
(async () => {
    const obj = await getStorage([CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY]);
    closeAssignHeader(!!obj[CLOSE_X_FRAME_OPTIONS], 'x-frame-options');
    closeAssignHeader(!!obj[CLOSE_CONTENT_SECURITY_POLICY], 'content-security-policy');
})();

// 取消指定的响应头
function closeAssignHeader (flag: boolean, name: 'x-frame-options' | 'content-security-policy') {

    if (flag) {
        chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: [name],
        });
    } else {
        chrome.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds: [name],
        });
    }

}

