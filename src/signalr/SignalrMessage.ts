import { ISignalrBean } from './signalr'

/**
 * Signalr消息注册销毁管理
 */
export default class SignalrMessage {
    /**
     * signalrbean对象
     */
    signalrbean: ISignalrBean

    event: SignalrEventBean = null as any

    constructor(signalrbean: ISignalrBean) {
        this.signalrbean = signalrbean
        this.event = new SignalrEventBean()
    }

    /**
     * 连接回调，通知连接上或重连上
     */
    onopen = () => {
        const _this = this
        Object.keys(this.event.eventMap).forEach((methodName) => {
            _this.signalrbean.connection.off(methodName)
            _this.signalrbean.connection.on(methodName, (data) => {
                _this.event.emit(methodName, data)
            })
        })
    }

    /**
     * 注册数据回调
     * @param methodName
     * @param fun
     * @returns
     */
    on = (methodName: string, fun: (data: any) => any) => {
        const _this = this
        const obj = _this.event.eventMap.get(methodName)

        if (obj === undefined) {
            //先销毁之前的
            _this.signalrbean.connection.off(methodName)
            //注册消息接收
            _this.signalrbean.connection.on(methodName, (data) => {
                _this.event.emit(methodName, data)
            })
        }

        return this.event.on(methodName, fun)
    }

    /**
     * 传入on方法返回的id进行销毁
     * @param uids
     * @returns
     */
    off = (...uids: string[]) => {
        this.event.off(...uids)
    }

    /**
     * 传入methodName进行销毁
     * @param uids
     * @returns
     */
    offName = (methodName: string) => {
        this.signalrbean.connection.off(methodName)
        this.event.eventMap.delete(methodName)
    }

    /**
     * 清空所有回调
     */
    clear = () => {
        this.event.clear()
    }
}

class SignalrEventBean {
    /**
     * 重新发送id
     */
    eventId: number = 1000

    /**
     * 获取重新发送id
     * @returns
     */
    getEventId = () => {
        this.eventId++
        return this.eventId + ''
    }

    eventMap = new Map()

    /**
        注册
     */
    on = (key: any, callback: any, ...target: any) => {
        let _this = this
        let uid = _this.getEventId()
        let uidObj = _this.eventMap.get(key)
        if (!uidObj) uidObj = []
        uidObj.push({ callback, target, uid, key })
        _this.eventMap.set(key, uidObj)
        return uid
    }

    /**
        调用
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
        销毁
     */
    off = (...uids: any) => {
        let _this = this

        _this.eventMap.forEach((ctxs, key) => {
            let arr: any[] = []
            for (let i = 0; i < ctxs.length; i++) {
                const ctx = ctxs[i]
                if (!uids.includes(ctx.uid)) {
                    arr.push(ctx)
                }
            }
            if (arr.length == 0) _this.eventMap.delete(key)
            else _this.eventMap.set(key, arr)
        })
    }

    clear = () => {
        this.eventMap = new Map()
    }
}
