import '@/common';
// import './index.css';
import {createApp} from 'vue';
import {chrome} from '@/utils';
import List from './List.vue';
// console.log('contentScripts');

// chrome.runtime.getURL("images/myimage.png");

chrome.runtime.onMessage.addListener((data) => {
    // console.log(createApp);
    // console.log(List);
    console.log(data);
    console.log(1);

    const divbox = document.createElement('div');
    divbox.id = 'idddd' + parseInt(Math.random() * 1000000000 + '') + '';

    document.body.appendChild(divbox);

    // global.createApp = self.createApp = createApp;
    // global.createApp = self.List = List;
    try {
        createApp(List).mount(`#${divbox.id}`);
        console.log('插入成功11');
    } catch (error) {
        console.log(error);
    }
});

