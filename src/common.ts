import $ from 'jquery';
import '@/assets/style/common.css';

const isChrome = typeof browser === 'undefined';
const isFirefox = !(typeof browser === 'undefined');

console.log(isChrome ? '谷歌' : '火狐');

// 挂全局
(self as any).$ = $;

// (self as any).mergeBrowser = null;
(self as any).mergeBrowser = typeof browser === 'undefined' ? chrome : browser;
