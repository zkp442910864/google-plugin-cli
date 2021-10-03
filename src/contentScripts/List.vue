<template>
    <div class="fixed-box">
        <div v-for="(item, index) in data" :key="index">
            {{item}}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {ref} from 'vue';

    const data = ref([1, 2, 3, 4, 5]);

</script>
