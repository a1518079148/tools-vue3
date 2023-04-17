import { App } from 'vue'

import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'

import System from '~/utils/System'
import sicon from './sicon/sicon.vue'

export const install = (app: App<Element>) => {
    app.component('sicon', sicon)
    app.directive('auth', {
        mounted(el: HTMLDivElement, binding) {
            if (!System.store.sys.auth.isPass(binding.value)) el.parentElement?.removeChild(el)
        }
    })
}

export default {
    install
}
