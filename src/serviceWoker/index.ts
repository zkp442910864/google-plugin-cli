// import {test} from '@/utils';
import '@/common';

mergeBrowser.runtime.onInstalled.addListener(() => {
    console.log('初始化');
});

// 增加右上角菜单点击效果
const addActionClickEvent = () => {
    // const url = chrome.runtime.getURL('tagView.html');

    mergeBrowser.action.onClicked.addListener(async () => {
        console.log(123);

        const [tab] = await mergeBrowser.tabs.query({url: 'chrome-extension://*/tagView.html'});

        if (tab && tab.id) {
            mergeBrowser.tabs.update(tab.id, {selected: true});
        } else {
            mergeBrowser.tabs.create({url: 'tagView.html'});
        }
    });

    // mergeBrowser.tabs.onRemoved.addListener((tId) => {
    //     if (tabId === tId) {
    //         tabId = 0;
    //     }
    // });
};

addActionClickEvent();

