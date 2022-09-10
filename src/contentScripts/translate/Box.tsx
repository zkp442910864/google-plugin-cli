
import {defineComponent, onBeforeUnmount, onMounted, ref, watchEffect, watch, toRef, toRaw, Ref} from 'vue';

import Item from './Item';
import {ISourceData, IItemData} from './index.d';

// 背景条逻辑
const useBgHeight = () => {
    const height = ref(0);

    const resize = () => {
        height.value = document.documentElement.scrollHeight;
    };

    onMounted(() => {
        resize();
        window.addEventListener('resize', resize, false);
    });

    onBeforeUnmount(() =>{
        window.removeEventListener('resize', resize, false);
    });

    return height;
};

// 拖拽块逻辑
const useDrag = () => {

    const left = ref();
    const isDrag = ref();
    let start = 0;

    const mousedown = (e: MouseEvent) => {
        start = e.clientX - (e.target as HTMLElement)?.getBoundingClientRect().left;
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        // e.stopPropagation();
        // e.preventDefault();
    };

    const mousemove = (e: MouseEvent) => {
        isDrag.value = true;
        // const fullWidth = window.innerWidth;
        const leftWidth = document.documentElement.scrollLeft + e.clientX;
        left.value = leftWidth - start;
    };

    const mouseup = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);

        setTimeout(() => {
            isDrag.value = false;
        });
    };

    return [left, isDrag, mousedown, mouseup] as [typeof left, typeof isDrag, typeof mousedown, typeof mouseup];
};

const Box = defineComponent<IProps>({
    setup(x, ctx) {
        // console.log(ctx.attrs.data);
        const props = ctx.attrs as typeof x;

        const list = ref<IItemData[]>([]);

        const height = useBgHeight();
        const [left, isDrag, mousedown, mouseup] = useDrag();

        watch(() => props.sourceData.value, (newVal) => {
            // const rawData = toRaw(newVal);
            const newArr: IItemData[] = [];

            newVal.forEach((data) => {
                const isLast = data.last;
                // 数据追加 上下浮动50
                const find = newArr.find(ii => data.top <= (ii.top + 50) && data.top >= (ii.top - 50));

                if (find) {
                    find.data.push(data);
                    isLast && (find.open = true);
                    // find.data = find.data.slice();
                } else {
                    newArr.push({top: data.top, data: [data], open: isLast});
                }
            });

            list.value = newArr;
        }, {immediate: true});

        return () => {
            const boxStyle = left.value ? {right: 'initial', left: `${left.value}px`} : {};
            return (
                <>
                    <div class="box" style={boxStyle}>
                        <div class="box-content" style={{height: `${height.value}px`}}>
                            {
                                list.value.map((item) => {
                                    return (
                                        <Item
                                            v-model:value={item.open}
                                            top={item.top}
                                            data={item.data}
                                            key={item.top}
                                            left={left.value}
                                            isDrag={isDrag.value}
                                            onCloseAll={() => {
                                                list.value.forEach(ii => (ii.open = false));
                                                list.value = list.value.slice();
                                            }}
                                            onMousedown={mousedown}
                                            onMouseup={mouseup}
                                        />
                                        // <div
                                        //     class="box-content-item"
                                        //     style={{top: `${item.top}px`}}
                                        //     title={`共${item.data.length}条翻译记录`}
                                        //     key={item.top}
                                        //     // onMousedown={mousedown}
                                        //     // onMouseup={mouseup}
                                        //     onClick={() => {
                                        //         if (isDrag.value) return;
                                        //         // console.log(123);
                                        //         item.open = !item.open;
                                        //     }}
                                        // >
                                        //     <Item
                                        //         v-model={item.open}
                                        //         data={item.data}
                                        //         top={item.top}
                                        //         left={left.value}
                                        //     />
                                        // </div>
                                    );
                                })
                            }
                        </div>
                        <div class="box-drag" title="滑动块" onMousedown={mousedown} onMouseup={mouseup}></div>
                    </div>
                </>
            );
        };
    },
});

export default Box;


interface IProps {
    /** 数据源 */
    sourceData: Ref<ISourceData[]>;
}
