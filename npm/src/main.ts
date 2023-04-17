import { createApp } from 'vue'
import 'tools-javascript'
import App from './App.vue'
import localcom from './components'
import { initRouter } from './router'
import './styles/index.less'
import Config from './utils/Config'

const app = createApp(App)
app.use(localcom).use(initRouter())

//#if-dev
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)
//#end

Config.init(app)
