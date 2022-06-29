import {default as chrome} from './chrome';

// 插件的 storage
export function setStorage (keyOrObj: string | IOBJ, data: any) {
    return new Promise<void>((rel) => {
        chrome.storage.local.set(typeof keyOrObj === 'string' ? {[keyOrObj]: data} : keyOrObj, () => {
            rel();
        });
    });
}

export function getStorage <T = any>(key: string | string[]) {
    return new Promise<T>((rel) => {
        chrome.storage.local.get(key, (result) => {
            rel(result as T);
        });
    });
}

export function removeStorage (key: string) {
    return new Promise<void>((rel) => {
        chrome.storage.local.remove(key, () => {
            rel();
        });
    });
}

export function getStorageSync <T = any>(key: string) {
    const result = chrome.storage.sync.get(key);
    return result;
}


