import {withModifiers, defineComponent, ref} from 'vue';

import Page from './Page';
import {createVueShadow} from './partUtils';
import styles from './index.css';

const Main = defineComponent({
    setup () {
        const click = () => {
            document.body.innerHTML = '';
            document.body.className = '';
            document.body.setAttribute('style', 'overflow: hidden;');
            createVueShadow(Page, styles);
        };

        return () => (
            <div class="fixed-btn-group">
                <div onClick={click}>拆分</div>
            </div>
        );
    },
});

export default Main;
