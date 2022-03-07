/* eslint-disable no-undef */

declare module '*.vue' {
    import {DefineComponent} from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    // const chrome: typeof import('@types/chrome');
    export default component;
}

declare module 'chrome.ts' {
    import '@types/chrome';
    // export default chrome;
}

declare interface IOBJ {
    [key: string]: any;
}

