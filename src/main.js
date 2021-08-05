import "./reset.css";
import 'csshake/dist/csshake.min.css'
import './libs/vivify/vivify.min.css'
import moment from "moment";
import ElementPlus from 'element-plus';
import './theme/index.css';
import "moment/dist/locale/zh-cn" // moment要引入中文包，否则不起作用
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App)
app.config.globalProperties.$moment = moment
app.use(ElementPlus)
app.mount("#app");
