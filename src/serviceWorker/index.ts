import '@/common';
import {chrome, getStorage} from '@/utils';
import {storageKey} from '@/config';

import {getTranslateLang} from './googleTranslateUtils';

const {CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION_TRANSLATE} = storageKey;


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

// 接收右键点击信息
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'translate') {
        // console.log(tab?.windowId);
        // console.log(tab?.id);
        console.log(info, tab);
        const tabId = tab?.id;

        if (!tabId) return;
        chrome.tabs.sendMessage(tabId, {translate: true, translateText: info.selectionText});
    }
});

// 监听存储
chrome.storage.onChanged.addListener((changes) => {
    Reflect.has(changes, CLOSE_X_FRAME_OPTIONS) && closeAssignHeader(!!changes[CLOSE_X_FRAME_OPTIONS]?.newValue, 'x-frame-options');
    Reflect.has(changes, CLOSE_CONTENT_SECURITY_POLICY) && closeAssignHeader(!!changes[CLOSE_CONTENT_SECURITY_POLICY]?.newValue, 'content-security-policy');
    Reflect.has(changes, CLOSE_ACTION_TRANSLATE) && rightBtnAction(!!changes[CLOSE_ACTION_TRANSLATE]?.newValue);
});

// 初始化
(async () => {
    const obj = await getStorage([CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION_TRANSLATE]);
    closeAssignHeader(!!obj[CLOSE_X_FRAME_OPTIONS], 'x-frame-options');
    closeAssignHeader(!!obj[CLOSE_CONTENT_SECURITY_POLICY], 'content-security-policy');
    rightBtnAction(!!obj[CLOSE_ACTION_TRANSLATE]);
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

// 开关右键菜单按钮
function rightBtnAction (enabled: boolean) {
    if (!enabled) {
        try {
            chrome.contextMenus.remove('translate');
        } catch (error) {
            console.error(error);
        }
        return;
    }

    chrome.contextMenus.create({
        contexts: ['selection'],
        // documentUrlPatterns: ['https://*/*'],
        id: 'translate',
        title: '翻译',
    });
}
