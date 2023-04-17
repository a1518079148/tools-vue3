import { reactive } from 'vue'
import conf from './conf'
import sys from './sys'
import text from './text'
import user from './user'

export default reactive({
    //静态配置
    conf: conf,

    text: text,

    sys: sys,

    user: user
})
