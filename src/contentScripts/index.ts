
import {Component, ComputedOptions, createApp, MethodOptions, DefineComponent} from 'vue';
// import shadow from 'vue-shadow-dom';
import {getStorage} from '@/utils';
import '@/common';
import {storageKey} from '@/config';

// import Page from './Page';
import Main from './Main';
import {createVueShadow} from './partUtils';
import styles from './index.css';

const {CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION} = storageKey;


(async () => {
    const obj = await getStorage(CLOSE_ACTION);
    const search = window.location.search;

    if (search.indexOf('__hideFlag__=1') > -1) return;

    if (!obj[CLOSE_ACTION]) return;

    createVueShadow(Main, styles);
})();
