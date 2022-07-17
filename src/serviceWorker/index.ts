import {chrome, getStorage} from '@/utils';
import {storageKey} from '@/config';

import {getTranslateLang} from './googleTranslateUtils';

const {CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION_TRANSLATE, CLOSE_ACTION_TRANSLATE_PAGE} = storageKey;


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
    console.log(info, tab);

    if (info.menuItemId === 'translate') {
        // console.log(tab?.windowId);
        // console.log(tab?.id);
        const tabId = tab?.id;
        if (!tabId) return;
        chrome.tabs.sendMessage(tabId, {translate: true, translateText: info.selectionText});
    } else if (info.menuItemId === 'translatePage') {
        const tabId = tab?.id;
        if (!tabId) return;
        chrome.tabs.sendMessage(tabId, {translatePage: true});
    }
});

// 监听存储
chrome.storage.onChanged.addListener((changes) => {
    Reflect.has(changes, CLOSE_X_FRAME_OPTIONS) && closeAssignHeader(!!changes[CLOSE_X_FRAME_OPTIONS]?.newValue, 'x-frame-options');
    Reflect.has(changes, CLOSE_CONTENT_SECURITY_POLICY) && closeAssignHeader(!!changes[CLOSE_CONTENT_SECURITY_POLICY]?.newValue, 'content-security-policy');
    Reflect.has(changes, CLOSE_ACTION_TRANSLATE) && rightSelectBtnAction(!!changes[CLOSE_ACTION_TRANSLATE]?.newValue);
    Reflect.has(changes, CLOSE_ACTION_TRANSLATE_PAGE) && rightPageBtnAction(!!changes[CLOSE_ACTION_TRANSLATE_PAGE]?.newValue);
});

// 初始化
(async () => {
    const obj = await getStorage([CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION_TRANSLATE, CLOSE_ACTION_TRANSLATE_PAGE]);
    closeAssignHeader(!!obj[CLOSE_X_FRAME_OPTIONS], 'x-frame-options');
    closeAssignHeader(!!obj[CLOSE_CONTENT_SECURITY_POLICY], 'content-security-policy');
    rightSelectBtnAction(!!obj[CLOSE_ACTION_TRANSLATE]);
    rightPageBtnAction(!!obj[CLOSE_ACTION_TRANSLATE_PAGE]);
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

// 开关选择右键菜单按钮
function rightSelectBtnAction (enabled: boolean) {
    const ID = 'translate';

    if (!enabled) {
        try {
            chrome.contextMenus.remove(ID);
        } catch (error) {
            console.error(error);
        }
        return;
    }

    chrome.contextMenus.create({
        contexts: ['selection'],
        id: ID,
        title: '翻译',
    });
}

// 开关页面右键菜单按钮
function rightPageBtnAction (enabled: boolean) {
    const ID = 'translatePage';

    if (!enabled) {
        try {
            chrome.contextMenus.remove(ID);
        } catch (error) {
            console.error(error);
        }
        return;
    }

    chrome.contextMenus.create({
        contexts: ['page'],
        id: ID,
        title: '翻译页面',
    });
}
