
import {defineComponent, FunctionalComponent, ref, VNodeRef, watch} from 'vue';

import {IItemData} from './index.d';
import TitleModule from './TitleModule';
// <{data: IData2; value?: boolean; left?: number}>

const Item = defineComponent<TProps>({
    // emits: ['update:value'],
    // props: ['data', 'left', 'modelValue', 'top'] as any,
    setup (x, ctx) {
        // const prop2s = ctx.attrs as IProps;
        const props = ctx.attrs as TProps;
        const emit = ctx.emit;

        const boxWinDom = ref<HTMLElement | null>(null);
        const list = ref<TList>([]);
        const isRight = ref(false);

        watch(
            () => [props.data, props.isLast] as [typeof props.data, boolean],
            ([newVal, isLast]) => {
                const data = newVal.reduce((map, item) => {

                    if (map[item.rawText]) {
                        if (item.index > map[item.rawText].index) {
                            map[item.rawText].textPromise = item.textPromise;
                        }

                        map[item.rawText].count += 1;
                        map[item.rawText].index = Math.max(map[item.rawText].index, item.index);
                    } else {
                        map[item.rawText] = {...item, count: 1};
                    }

                    return map;
                }, {} as Record<string, TList[number]>);

                // 滚动置顶
                if (isLast && boxWinDom.value) {
                    // console.log(boxWinDom.value);
                    boxWinDom.value.scrollTop = 0;
                }

                // console.log(data);
                list.value = Object.values(data).sort((a, b) => b.index - a.index);
            },
            {immediate: true}
        );

        watch(() => props.left, (newVal) => {

            isRight.value = (window.innerWidth - newVal) > 350;

        }, {immediate: true});


        return () => {

            return (
                <>
                    <div
                        class="box-content-item"
                        style={{top: `${props.top}px`}}
                        key={props.top}
                    >
                        <div ref={boxWinDom} class={['box-win', isRight.value ? 'right' : '']} v-show={props.value}>
                            {
                                list.value.map((item) => {
                                    return (
                                        <div class="box-win-item">
                                            {/* <div class="box-win-item-title">{item.text}</div> */}
                                            <TitleModule titlePromise={item.textPromise}/>
                                            <div class="color-gray ellipsis" title={item.rawText}>原文: {item.rawText}</div>
                                            <div class="color-gray">翻译次数: {item.count}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div
                        class="box-content-item"
                        style={{top: `${props.top}px`}}
                        title={`共${list.value.length}条翻译记录`}
                        key={props.top}
                        onMousedown={props.onMousedown}
                        onMouseup={props.onMouseup}
                        onClick={() => {
                            if (props.isDrag) return;
                            props.onCloseAll();
                            emit('update:value', !props.value);
                        }}
                    />
                </>
            );
        };
    },
});

export default Item;

type TProps = {
    data: IItemData['data'];
    value?: boolean;
    left: number;
    top: number;
    isDrag: boolean;
    isLast: boolean;
    /** 关闭所有 */
    onCloseAll: () => void;
    onMousedown?: any;
    onMouseup?: any;
};

// interface IProps {
//     data: IItemData['data'];
//     value?: boolean;
//     left: number;
//     top: number;
// }

type TList = Array<IItemData['data'][number] & {count: number}>;
