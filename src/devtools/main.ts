// import '@/common';
import {chrome} from '@/utils';
// import {createApp} from 'vue';
// import App from './App.vue';


chrome.devtools.panels.create('test', '', 'panel.html');
// chrome.devtools.panels
// chrome.devtools.inspectedWindow.eval(
//     'window',
//     function(result, isException) {
//         if (isException) {
//             console.log('the page is not using jQuery');
//         } else {
//             console.log('The page is using jQuery v' + result);
//         }
//     }
// );
// createApp(App).mount('#app');
