
import {defineComponent, onBeforeUnmount, onMounted, ref, watchEffect, watch, toRef, toRaw} from 'vue';

import {IData, IData2} from './index.d';

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

const Box = defineComponent({
    setup(this, props, ctx) {
        // console.log(ctx.attrs.data);
        const height = useBgHeight();
        const [left, isDrag, mousedown, mouseup] = useDrag();
        const list = ref<IData2[]>([]);

        watch<IData[]>(ctx.attrs.data as IData[], (newVal) => {
            const rawData = newVal.slice();
            // console.log(newVal);
            // console.log(rawData);

            const newArr: IData2[] = [];

            rawData.forEach((data) => {
                let find;
                if (newArr.length && (find = newArr.find(ii => data.top <= (ii.top + 50) && data.top >= (ii.top - 50)))) {
                    find.data.push(data);
                } else {
                    newArr.push({top: data.top, data: [data]});
                }
            });

            // console.log(newArr);
            list.value = newArr;
        });

        return () => {
            const boxStyle = left.value ? {right: 'initial', left: `${left.value}px`} : {};
            return (
                <>
                    <div class="box" style={boxStyle}>
                        <div class="box-content" style={{height: `${height.value}px`}}>
                            {
                                list.value.map((item) => {
                                    return (
                                        <div
                                            class="box-content-item"
                                            style={{top: `${item.top}px`}}
                                            title={`共${item.data.length}条翻译记录`}
                                            key={item.top}
                                            onMousedown={mousedown}
                                            onMouseup={mouseup}
                                            onClick={() => {
                                                if (isDrag.value) return;
                                                console.log(123);
                                            }}
                                        >
                                            <div class="box-win">1</div>
                                        </div>
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
