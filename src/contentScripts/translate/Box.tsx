
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
    let start = 0;

    const mousedown = (e: MouseEvent) => {
        start = e.clientX - (e.target as HTMLElement)?.getBoundingClientRect().left;
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    };

    const mousemove = (e: MouseEvent) => {
        // const fullWidth = window.innerWidth;
        const leftWidth = document.documentElement.scrollLeft + e.clientX;
        left.value = leftWidth - start;
    };

    const mouseup = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
    };

    return [left, mousedown, mouseup] as [typeof left, typeof mousedown, typeof mouseup];
};

const Box = defineComponent({
    setup(this, props, ctx) {
        // console.log(ctx.attrs.data);
        const height = useBgHeight();
        const [left, mousedown, mouseup] = useDrag();
        const list = ref<IData2[]>([]);

        watch<IData[]>(ctx.attrs.data as IData[], (newVal) => {
            const rawData = newVal.slice().map(ii => toRaw(ii));
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
                                        <div class="box-content-item" style={{top: `${item.top}px`}} key={item.top}></div>
                                    );
                                })
                            }
                        </div>
                        <div class="box-drag" title="滑动块" onMousedown={mousedown} onMouseup={mouseup} ></div>
                    </div>
                </>
            );
        };
    },
});

export default Box;
