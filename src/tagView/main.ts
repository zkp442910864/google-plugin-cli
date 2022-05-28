
import {createApp} from 'vue';
// import {Button, Alert, Form, Input, DatePicker, ConfigProvider, Select} from 'ant-design-vue';
// import zhCN from 'ant-design-vue/es/locale/zh_CN';
// import moment from 'moment';
import '@/common';
import '@/assets/style/common.css';
import App from './App.vue';

import 'moment/dist/locale/zh-cn';
import 'ant-design-vue/es/message/style/index.css';

const app = createApp(App);

// moment.locale(zhCN.locale);

// app.use(ConfigProvider);
// app.use(DatePicker);
// app.use(Form);
// app.use(Input);
// app.use(Select);
// app.use(Alert);
// app.use(Button);
app.mount('#app');

// chrome.runtime.onInstalled.addListener()

