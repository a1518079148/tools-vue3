/**
 * 事件管理对象
 */
export default class CEventBean {
    /**
     * 事件id
     */
    private eventId: number = 1000

    /**
     * 获取事件id
     * @returns
     */
    private getEventId = () => this.eventId++

    eventMap = new Map()

    tag = '__CEventBean__'

    /**
     * 注册
     * @param key 注册名称
     * @param callback 执行回调
     * @param target 附带信息
     * @returns 返回唯一注册id
     */
    on = (key: any, callback: any, ...target: any) => {
        let _this = this
        let uid = _this.tag + _this.getEventId()
        let uidObj = _this.eventMap.get(key)
        if (!uidObj) uidObj = []
        uidObj.push({ callback, target, uid, key })
        _this.eventMap.set(key, uidObj)
        return uid
    }

    /**
     * 调用
     * @param key 注册名称
     * @param data 回调函数传入参数
     */
    emit = (key: any, data: any) => {
        let _this = this
        _this.eventMap.forEach((ctxs) => {
            ctxs.forEach((ctx: any) => {
                if (ctx.key === key) {
                    if (ctx?.callback) {
                        if (ctx.target) ctx.callback(data, ...ctx.target)
                        else ctx.callback(data)
                    }
                }
            })
        })
    }

    /**
     * 销毁
     * @mode 模式1:多id或者key名称传入-off('onid1')、off('onid1','getData'...)
     * @mode 模式2:on方法传入的key和方法-off('getData',fun)
     * @param uids-传入的是id或者key加方法清理的是key的单个注册，传入的是key清理key所有注册
     */
    off = (...uids: any) => {
        let _this = this

        //判断是不是通过方法名称销毁
        if (uids.length === 2) {
            const _name = uids[0]
            const _fun = uids[1]
            if (typeof _fun === 'function') {
                const ctxs = _this.eventMap.get(_name)
                if (ctxs) {
                    let _arr: any[] = ctxs.filter((_el: any) => _el.callback !== _fun)
                    if (_arr.length == 0) _this.eventMap.delete(_name)
                    else _this.eventMap.set(_name, _arr)
                }
                return
            }
        }

        //需要销毁的on方法uid
        let eventIds: any[] = []
        //需要销毁的on方法key
        let eventKeys: any[] = []
        uids.forEach((_el: any) => {
            if (_el.indexOf(_this.tag) !== -1) {
                eventIds.push(_el)
            } else {
                eventKeys.push(_el)
            }
        })

        if (eventIds.length > 0) {
            _this.eventMap.forEach((ctxs, key) => {
                let _arr: any[] = ctxs.filter((_el: any) => !eventIds.includes(_el.uid))
                if (_arr.length == 0) _this.eventMap.delete(key)
                else _this.eventMap.set(key, _arr)
            })
        }

        eventKeys.forEach((_el) => {
            _this.eventMap.delete(_el)
        })
    }

    clear = () => {
        this.eventMap = new Map()
    }
}
