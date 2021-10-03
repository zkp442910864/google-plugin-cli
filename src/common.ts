import '@/assets/style/common.css';

const isChrome = typeof browser === 'undefined';
const isFirefox = !(typeof browser === 'undefined');

console.log(isChrome ? '谷歌' : '火狐');

// (self as any).mergeBrowser = null;
(self as any).mergeBrowser = typeof browser === 'undefined' ? chrome : browser;
