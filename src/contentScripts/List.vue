<template>
    <div class="fixed-box">
        <div>
            <div v-for="(item, index) in data" :key="index" @click="click(item)">
                {{item}}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {ref} from 'vue';

    const data = ref([1, 2, 3, 4, 5]);

    const click = (val: any) => {
        alert(val);
        console.log(document);
    };

</script>
