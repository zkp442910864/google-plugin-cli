
declare module '*.vue' {
    import {DefineComponent} from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    // const chrome: typeof import('@types/chrome');
    export default component;
}

declare interface IOBJ {
    [key: string]: any;
}

// declare let chrome: typeof import('@types/chrome');

declare let browser: typeof chrome;

/**
 * chrome 和 Firefox
 *
 * 合并后的浏览器api
 */
declare let mergeBrowser: typeof chrome;
