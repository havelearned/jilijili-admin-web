import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {Quasar} from 'quasar'
import quasarUserOptions from './quasar-user-options'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';


import {axiosInstance, exportFile, downFile} from "@/boot/api/request";
import {axiosIns, downFilePlus, exportFilePlus} from "@/boot/api/reqGateway";
import {info, warn, error, retMsg} from '@/boot/msg'

import {event} from '@/boot/eventBus'


VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

 const app = createApp(App)
app.config.globalProperties.$axios = axiosInstance
app.config.globalProperties.$downFile = downFile;
app.config.globalProperties.$exportFile = exportFile;

app.config.globalProperties.$axiosPlus = axiosIns
app.config.globalProperties.$downFilePlus = downFilePlus;
app.config.globalProperties.$exportFilePLus = exportFilePlus;


app.config.globalProperties.$info = info;
app.config.globalProperties.$warn = warn;
app.config.globalProperties.$error = error;
app.config.globalProperties.$retMsg = retMsg;
app.config.globalProperties.$bus = event;


app.use(Quasar, quasarUserOptions)
    .use(store)
    .use(router)
    .use(VueMarkdownEditor)
    .use(VMdPreview)
    .mount('#app')



