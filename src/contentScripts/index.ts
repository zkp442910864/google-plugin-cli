
import {Component, ComputedOptions, createApp, MethodOptions, DefineComponent} from 'vue';
// import shadow from 'vue-shadow-dom';
// import {chrome} from '@/utils';
import '@/common';
// import Page from './Page';
import Main from './Main';
import {createVueShadow} from './partUtils';
import styles from './index.css';


console.log(123);

createVueShadow(Main, styles);
