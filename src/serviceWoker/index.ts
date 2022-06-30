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

        if (Reflect.has(changes, CLOSE_X_FRAME_OPTIONS)) {
            const item = changes[CLOSE_X_FRAME_OPTIONS];
            const type = 'x-frame-options';
            if (item && item.newValue) {
                stopMap[type] = closeAssignHeader(type);
            } else {
                console.log(type);
                stopMap[type]?.();
            }
        }

        if (Reflect.has(changes, CLOSE_CONTENT_SECURITY_POLICY)) {
            const item = changes[CLOSE_CONTENT_SECURITY_POLICY];
            const type = 'content-security-policy';
            if (item && item.newValue) {
                stopMap[type] = closeAssignHeader(type);
            } else {
                console.log(type);
                stopMap[type]?.();
            }
        }
    });
})();

// chrome.declarativeNetRequest.updateDynamicRules({
//     addRules: [
//         {
//             id: 11,
//             priority: 1,
//             condition: {
//                 requestDomains: [
//                     'https://www.google.com.hk',
//                 ],
//             },
//             action: {
//                 type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
//                 requestHeaders: [
//                     {
//                         header: 'xxxx',
//                         operation: chrome.declarativeNetRequest.HeaderOperation.APPEND,
//                         value: 'xxxxxxxxx',
//                     }
//                 ],
//             },
//         }
//     ],
// }, (...arg: any) => {
//     console.log(arg);
// });

// try {
//     chrome.declarativeNetRequest.updateSessionRules({
//         removeRuleIds : [1, 12],
//         addRules: [
//             {
//                 id: 1,
//                 priority: 1,
//                 condition: {
//                     // requestDomains: [
//                     //     'https://www.google.com.hk',
//                     // ],
//                 },
//                 action: {
//                     type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
//                     responseHeaders: [
//                         {
//                             header: 'x-frame-options',
//                             operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
//                         },
//                         {
//                             header: 'content-security-policy',
//                             operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
//                         },
//                         {
//                             header: 'xxxx',
//                             operation: chrome.declarativeNetRequest.HeaderOperation.SET,
//                             value: 'xxxxxxxxx',
//                         }
//                     ],
//                     requestHeaders: [
//                         {
//                             header: 'xxxx',
//                             operation: chrome.declarativeNetRequest.HeaderOperation.SET,
//                             value: 'xxxxxxxxx',
//                         }
//                     ],
//                 },
//             }
//         ],
//     }, (...arg: any) => {
//         console.log(arg);
//     });
//     // chrome.declarativeNetRequest.testMatchOutcome({
//     //     url: 'https://www.google.com.hk',
//     //     type: 'main_frame',
//     // }, (...arg: any) => {
//     //     console.log(arg);
//     // });
//     chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
//         console.log(info);
//     });
// } catch (error) {
//     console.log(error);
// }

// 取消指定的响应头
function closeAssignHeader (name: 'x-frame-options' | 'content-security-policy') {

    // const ID = parseInt(`${1 + Math.random() * 1000}`);
    // chrome.declarativeNetRequest.updateSessionRules({
    //     addRules: [
    //         {
    //             id: ID,
    //             priority: 1,
    //             condition: {
    //                 requestDomains: [
    //                     'https://www.google.com.hk',
    //                 ],
    //             },
    //             action: {
    //                 type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
    //                 responseHeaders: [
    //                     {
    //                         header: name,
    //                         operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
    //                     }
    //                 ],
    //                 requestHeaders: [
    //                     {
    //                         header: 'xxxx',
    //                         operation: chrome.declarativeNetRequest.HeaderOperation.APPEND,
    //                         value: 'xxxxxxxxx',
    //                     }
    //                 ],
    //             },
    //         }
    //     ],
    // }, (...arg: any) => {
    //     console.log(arg);
    // });

    // return () => {
    //     chrome.declarativeNetRequest.updateSessionRules({
    //         removeRuleIds: [ID]
    //     });
    // };

    const fn = (details: chrome.webRequest.WebResponseHeadersDetails) => {
        console.log(name);

        const headers = details.responseHeaders?.filter((item) => {

            console.log(item.name);
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

