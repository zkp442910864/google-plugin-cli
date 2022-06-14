
import {Component, ComputedOptions, createApp, MethodOptions, DefineComponent} from 'vue';
// import shadow from 'vue-shadow-dom';
import {chrome} from '@/utils';
import '@/common';
import List from './List.vue';
import List1 from './List1';
import styles from './index.css';
// console.log('contentScripts');

// chrome.runtime.getURL("images/myimage.png");
// const dom = document.createElement('div');
// dom.id = 'eee';
// document.body.appendChild(dom);
// createApp(List).mount('#eee');

console.log(1);
// console.log(styles);
// const divbox = document.createElement('div');
// document.body.appendChild(divbox);
// const app = createApp(List);
// app.mount(divbox);

// chrome.runtime.onMessage.addListener((data) => {
//     // console.log(createApp);
//     // console.log(List);
//     console.log(data);
//     console.log(1);

//     const app = createApp(List);
//     app.use(shadow);
//     // const divbox = document.createElement('div');
//     // divbox.id = 'idddd' + parseInt(Math.random() * 1000000000 + '') + '';
//     // document.body.appendChild(divbox);
//     // try {
//     //     createApp(List).mount(`#${divbox.id}`);
//     //     console.log('插入成功11');
//     // } catch (error) {
//     //     console.log(error);
//     // }
// });

// shadow 方式一
// createVueShadow(List, styles);
createVueShadow(List1, styles);

// shadow 方式二
// {
//     class CustomBox extends HTMLElement {
//         constructor () {
//             super();

//             const shadow = this.attachShadow({mode: 'open'});
//             const divbox = document.createElement('div');
//             const style = document.createElement('style');

//             style.textContent = styles;
//             shadow.appendChild(style);
//             shadow.appendChild(divbox);

//             const app = createApp(List);
//             app.mount(divbox);
//         }
//     }

//     customElements.define('custom-box', CustomBox);
//     const divbox = document.createElement('custom-box');
//     document.body.appendChild(divbox);
// }

function createVueShadow (Component: DefineComponent<any, any, any, ComputedOptions, MethodOptions>, styleStr: string | null) {
    const shadowBox = document.createElement('div');
    const shadow = shadowBox.attachShadow({mode: 'open'});

    const style = document.createElement('style');
    const divbox = document.createElement('div');

    style.textContent = styleStr;
    shadow.appendChild(style);
    shadow.appendChild(divbox);

    const app = createApp(Component);
    app.mount(divbox);
    document.body.appendChild(shadowBox);

    return shadow;
}
