import store from '~/store/store'
import { Router } from '~/vite-env'
import { AxiosBean } from 'tools-vue3'
import { ElLoading, ElMessage } from 'element-plus'

export default class System {
    /**
     * 缓存
     */
    static store = store

    /**
     * 路由
     */
    static router: Router

    /**
     * http请求
     */
    static http: AxiosBean

    //静态资源存放路径 如/static_admin
    static static: string = '/#{static}'

    /**
     * 失败提示
     * @param content
     * @param options
     */
    static er = (content: string, options: any = {}) => {
        const optionObj = Object.assign(
            {
                message: content,
                type: 'error'
            },
            options
        )
        ElMessage(optionObj)
    }

    /**
     * 成功提示
     * @param content
     * @param options
     */
    static sr = (content: string, options: any = {}) => {
        const optionObj = Object.assign(
            {
                message: content,
                type: 'success'
            },
            options
        )
        ElMessage(optionObj)
    }

    private static loadingObj: {
        setText: (text: string) => void
        close: () => void
        visible: import('vue').Ref<boolean>
        fullscreen: import('vue').Ref<boolean>
        lock: import('vue').Ref<boolean>
        closed?: import('vue').Ref<(() => void) | undefined> | undefined
    } = null as any

    /**
     * 加载中
     * @param show
     * @param text
     */
    static loading = (show: boolean, text: string = '加载中') => {
        if (!this.loadingObj)
            this.loadingObj = ElLoading.service({
                lock: true,
                text,
                background: 'rgba(0, 0, 0, 0.3)'
            })
        if (show) this.loadingObj.setText(text)
        this.loadingObj.visible.value = show
    }
}
