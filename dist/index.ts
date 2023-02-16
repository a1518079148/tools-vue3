import { ComponentInternalInstance, getCurrentInstance, onUnmounted } from 'vue'

class CVue3 {
    /**
     * 注册销毁事件
     */
    static onDispose = (fun: () => void) => {
        const vm = getCurrentInstance() as ComponentInternalInstance
        let pnode = vm.vnode.el?.parentElement?.parentElement
        let isDispose = false
        const timer = setInterval(() => {
            if (isDispose) {
                clearInterval(timer)
                return
            }
            const pnodeT = vm.vnode.el?.parentElement?.parentElement
            if (pnode === undefined) {
                pnode = pnodeT
            }
            if (pnode) {
                if (!pnodeT) {
                    clearInterval(timer)
                    fun()
                    return
                }
            }
        }, 50)
        onUnmounted(() => {
            isDispose = true
            fun()
        })
    }
}


export { CVue3 }
