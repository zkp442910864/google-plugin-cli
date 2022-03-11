

<template>
    <div class="asdfsdf">
        <div @click="qwe">
            123
        </div>
        <!-- <img
            alt="Vue logo"
            src="../assets/logo.png"
        > -->
        <!-- <div @click="aa">
            popupView
        </div> -->
    </div>
</template>

<script lang="ts">

    import {defineComponent} from 'vue';
    import {chrome} from '@/utils';

    // const backgroundPageConnection = chrome.runtime.connect({
    //     name: 'panel'
    // });
    console.log = (msg: any) => {
        chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, msg, {}, (e) => {
            // console.log(e);
        });
    };

    export default defineComponent({
        setup () {
            chrome.devtools.network.onRequestFinished.addListener((request) => {
                console.log(111);
                // if (request._resourceType === 'fetch') {
                //     console.log(request);
                // }
                request.getContent((body) => {
                    console.log(body);
                });
            });

            chrome.debugger.attach({
                tabId: chrome.devtools.inspectedWindow.tabId,
            }, '0.1', () => {
                console.log('attach');
                chrome.debugger.getTargets((e) => {
                    console.log(e);
                });

                chrome.debugger.sendCommand({tabId: chrome.devtools.inspectedWindow.tabId}, 'post', {}, (result) => {
                    console.log(result);
                });
            });


            return {
                qwe () {
                    // console.log(123);
                    // alert(backgroundPageConnection.name);

                    // backgroundPageConnection.postMessage({
                    //     // name: 'init',
                    //     tabId: chrome.devtools.inspectedWindow.tabId,
                    //     content: '123123'
                    // });
                    console.log(222);

                }
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
