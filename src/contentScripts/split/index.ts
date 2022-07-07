
import {ref} from 'vue';
// import shadow from 'vue-shadow-dom';
import {getStorage} from '@/utils';
import '@/common';
import {storageKey} from '@/config';

// import Page from './Page';
import Main from './Main';
import {createVueShadow} from '../partUtils';
import styles from './index.less';

const {CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION} = storageKey;

// console.log(getStorage);

(async () => {
    const obj = await getStorage(CLOSE_ACTION);
    const url = window.location.href;

    if (url.indexOf('__hideFlag__=1') > -1) return;

    if (!obj[CLOSE_ACTION]) return;

    // const a = ref(22);
    createVueShadow(Main, styles);

    // setTimeout(() => {
    //     a.value = 33;
    // }, 10000);
})();
