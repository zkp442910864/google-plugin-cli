/* eslint-disable no-undef */
// 兼容文件
import 'webextension-polyfill';

/**
 * chrome 和 Firefox
 *
 * 合并后的浏览器api
 */
const g = self as IOBJ;
export const isChrome = typeof g.browser === 'undefined';
export const isFirefox = !(typeof g.browser === 'undefined');

// console.log(isChrome ? '谷歌' : '火狐');

export default (typeof g.browser === 'undefined' ? g.chrome : g.browser) as typeof chrome;

