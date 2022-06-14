import {withModifiers, defineComponent, ref} from 'vue';

const List2 = ({count}: any) => {
    // const count = ref(0);

    // const inc = (e: MouseEvent) => {
    //     console.log(e);
    //     count.value++;
    // };

    // console.log(1);

    return (
        <>
            <div>{count.value}</div>
            <div>{count.value}</div>
        </>
    );
}

// const App = () => {
//     const count = ref(0);

//     const inc = (e: MouseEvent) => {
//         console.log(e);
//         count.value++;
//     };

//     console.log(1);

//     return (
//         <>
//             <span onClick={(e) => inc(e)}>I'm{count.value}</span>
//             <span>Fragment</span>
//         </>
//     );
// };

const List1 = defineComponent({
    setup () {
        const count = ref(0);

        const inc = (e: MouseEvent) => {
            console.log(e);
            count.value++;
        };

        console.log(1);

        return () => (
            <>
                <div onClick={(e) => inc(e)}>{count.value}</div>
                <div onClick={withModifiers(inc, ["self"])}>{count.value}</div>
                <List2 count={count}/>
            </>
        );
    },
});

export default List1;
