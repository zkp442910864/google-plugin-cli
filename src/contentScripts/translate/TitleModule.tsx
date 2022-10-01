
import {defineComponent, reactive, watch} from 'vue';

const TitleModule = defineComponent<IProps>({
    setup: (x, ctx) => {
        const props = ctx.attrs as IProps;
        const state = reactive({
            text: '',
            loading: true,
        });


        watch(() => props.titlePromise, (newPromise) => {
            state.loading = true;

            // console.log(newPromise);

            if (newPromise) {
                newPromise.then((strArr) => {
                    state.text = strArr[0];
                    state.loading = false;
                }).catch((error) => {
                    console.error(error);

                    state.text = `报错了 ${error.toString()}`;
                    state.loading = false;
                });
            } else {
                state.loading = false;
                state.text = '无';
            }

        }, {immediate: true, deep: true});

        return () => {
            return (
                <>
                    <div class="box-win-item-title">
                        {
                            state.loading ? '请求中' : state.text
                        }
                    </div>
                </>
            );
        };
    }
});

export default TitleModule;

interface IProps {
    titlePromise?: Promise<string[]>;
}
