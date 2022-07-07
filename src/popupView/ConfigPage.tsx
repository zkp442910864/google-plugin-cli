
import {defineComponent, ref} from 'vue';

import {getStorage, setStorage} from '@/utils';
import {storageKey} from '@/config';

const {CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION, CLOSE_ACTION_TRANSLATE, CLOSE_ACTION_TRANSLATE_PAGE} = storageKey;

const ConfigPage = defineComponent({
    setup(this, props, ctx) {
        const state = ref({
            closeXFrameOptions: false,
            closeContentSecurityPolicy: false,
            closeAction: false,
            closeActionTranslate: false,
            closeActionTranslatePage: false,
        });

        const initData = async () => {
            const obj = await getStorage([CLOSE_X_FRAME_OPTIONS, CLOSE_CONTENT_SECURITY_POLICY, CLOSE_ACTION, CLOSE_ACTION_TRANSLATE, CLOSE_ACTION_TRANSLATE_PAGE]);
            state.value = {
                closeXFrameOptions: !!obj[CLOSE_X_FRAME_OPTIONS],
                closeContentSecurityPolicy: !!obj[CLOSE_CONTENT_SECURITY_POLICY],
                closeAction: !!obj[CLOSE_ACTION],
                closeActionTranslate: !!obj[CLOSE_ACTION_TRANSLATE],
                closeActionTranslatePage: !!obj[CLOSE_ACTION_TRANSLATE_PAGE],
            }
        };

        const changeData = (event: Event) => {
            // console.log(event);
            const target = event.target as any;
            if (!target) return;

            const rawData = state.value;
            const name = target.name;
            const value = target.checked;
            state.value = {
                ...rawData,
                [name]: value
            };
            setStorage(name, value);
        }

        initData();

        return () => {
            return (
                <div class="box">
                    <label >
                        <input type="checkbox" checked={state.value.closeAction} name={CLOSE_ACTION} onChange={changeData}/>
                        开启右下角按钮
                    </label>

                    <label >
                        <input type="checkbox" checked={state.value.closeActionTranslate} name={CLOSE_ACTION_TRANSLATE} onChange={changeData}/>
                        开启右键选择翻译
                    </label>

                    <label >
                        <input type="checkbox" checked={state.value.closeActionTranslatePage} name={CLOSE_ACTION_TRANSLATE_PAGE} onChange={changeData}/>
                        开启右键翻译页面
                    </label>

                    <label >
                        <input type="checkbox" checked={state.value.closeXFrameOptions} name={CLOSE_X_FRAME_OPTIONS} onChange={changeData}/>
                        关闭 x-frame-options
                    </label>

                    <label >
                        <input type="checkbox" checked={state.value.closeContentSecurityPolicy} name={CLOSE_CONTENT_SECURITY_POLICY} onChange={changeData}/>
                        关闭 content-security-policy
                    </label>
                </div>
            );
        };
    },
});


export default ConfigPage;
