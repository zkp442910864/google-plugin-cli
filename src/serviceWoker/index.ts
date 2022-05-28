import '@/common';
import {chrome} from '@/utils';
/**
 * TODO:
 * 浏览器不支持 serviceWorker 的时候，建议写两个版本的 serviceWorker(es5, es6)
 * 然后再使用一个新的 serviceWorker，在这里面实现动态注册
 *
 * https://github.com/w3c/ServiceWorker/issues/1582
 */

/* 例子:
    async function registerSW () {
        try {
            await navigator.serviceWorker.register('es-module-sw.js', {
                type: 'module',
            });
        } catch (error) {
            await navigator.serviceWorker.register('import-scripts-sw.js');
        }
    }
 */

chrome.runtime.onInstalled.addListener(() => {
    console.log('初始化');
});

// 监听 tabs
const addTabsListener = () => {

    const sendMessage = (tabId: number) => {
        chrome.tabs.sendMessage(tabId, '打开页面就发送', (result) => {
            console.log('发送结果', result);
        });
    };

    const handle = async (tabId?: number) => {
        if (!tabId) return;

        const tab = await chrome.tabs.get(tabId);
        sendMessage(tabId);
        console.log(tab);
    };


    chrome.tabs.onActivated.addListener((activeInfo) => {
        handle(activeInfo.tabId);
    });

    chrome.tabs.onUpdated.addListener((tabId) => {
        // handle(tabId);
    });
};
addTabsListener();

// 定时器
// const alarms = () => {
//     const create = () => {
//         chrome.alarms.create({
//             when: Date.now() + 1000,
//         });
//     };
//     create();
//     // 监听触发
//     chrome.alarms.onAlarm.addListener((alarm) => {
//         create();
//         console.log(123, alarm);
//     });
// };
// alarms();

// 拦截请求
// const webRequest = () => {
// };
// webRequest();

// 增加右上角菜单点击效果
// const addActionClickEvent = () => {
//     // const url = chrome.runtime.getURL('tagView.html');
//     chrome.action.onClicked.addListener(async () => {
//         const [tab] = await chrome.tabs.query({url: 'chrome-extension://*/tagView.html'});
//         if (tab && tab.id) {
//             chrome.tabs.update(tab.id, {selected: true});
//         } else {
//             chrome.tabs.create({url: 'tagView.html'});
//         }
//     });
// };
// addActionClickEvent();

