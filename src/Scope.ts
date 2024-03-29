import { getCurrentInstance } from 'vue'

const funKey = '__scopefun'
const objKey = '__scopeObjFun'
/**
 * 局部成员
 */
export default class Scope {
    static onFun = (key: string, fun: Function) => {
        const vm: any = getCurrentInstance()
        if (vm) {
            let funs = vm[funKey]
            if (!funs) funs = []
            funs.push({
                key,
                fun
            })
            vm[funKey] = funs
        }
    }
    static getFun = (key: string) => {
        let vm: any = getCurrentInstance()
        let funs = [] as ScopeItem[]
        while ((vm = vm.parent)) {
            const _funs: ScopeItem[] | null = vm[funKey]
            if (_funs) {
                _funs.forEach((_fun) => {
                    if (_fun.key === key) funs.push(_fun)
                })
            }
        }
        const emitFun = (...data: any) => {
            funs.forEach((_fun: ScopeItem | any) => {
                _fun.fun(...data)
            })
        }
        return { emitFun }
    }

    /**
     * 创建组件内共享变量
     * @param key 共享名称
     * @param getObjFun 返回reactive对象或者返回reactive对象的方法
     */
    static createObj = (key: string, getObjFun: any) => {
        const vm: any = getCurrentInstance()
        let obj = getObjFun
        if (typeof obj !== 'function') {
            obj = () => {
                return getObjFun
            }
        }
        if (vm) {
            let funs = vm[objKey]
            if (!funs) funs = []
            funs.push({
                key,
                fun: obj
            })
            vm[objKey] = funs
        }
    }

    /**
     * 获取组件内共享变量
     * @param key 共享名称
     * @param index 级别-存在多个时用到，默认为1
     * @returns
     */
    static useObj = <T = any>(key: string, index: number = 1): T => {
        let vm: any = getCurrentInstance()
        let run = 0
        let fun: any = () => null
        while ((vm = vm.parent)) {
            const _funs: ScopeItem[] | null = vm[objKey]
            if (_funs) {
                for (let i = 0; i < _funs.length; i++) {
                    const _fun = _funs[i]
                    if (_fun.key === key) {
                        run++
                        fun = _fun.fun
                        if (run === index) {
                            return _fun.fun()
                        }
                    }
                }
            }
        }
        return fun()
    }
}

type ScopeItem = { key: string; fun: Function }
