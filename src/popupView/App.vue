

<template>
    <div class="asdfsdf">
        <img
            alt="Vue logo"
            src="../assets/logo.png"
        >
        <div @click="aa">
            popupView
        </div>
    </div>
</template>

<script lang="ts">
    // This starter template is using Vue 3 <script setup> SFCs
    // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
    import {defineComponent} from 'vue';
    import {chrome} from '@/utils';

    export default defineComponent({
        setup () {
            const aa = () => {
                chrome.tabs.create({url: 'tagView.html'});
                // mergeBrowser.permissions.request({
                //     permissions: ['activeTab'],
                // // origins: ['https://www.google.com/']
                // }, (granted) => {
                //     // The callback argument will be true if the user granted the permissions.
                //     if (granted) {
                //         console.log(granted, 1);
                //     } else {
                //         console.log(granted, 2);
                //     }
                // });
            };

            return {
                aa
            };
        }
    });

</script>

<style>
    .asdfsdf{
        width: 150px;
        height: 150px;
    }
</style>
