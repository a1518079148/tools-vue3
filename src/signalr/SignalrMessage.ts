import { ISignalrBean } from './signalr'
import CEventBean from '../CEventBean'

/**
 * Signalr消息注册销毁管理
 */
export default class SignalrMessage {
    /**
     * signalrbean对象
     */
    signalrbean: ISignalrBean

    event: CEventBean = new CEventBean()

    constructor(signalrbean: ISignalrBean) {
        this.signalrbean = signalrbean
    }

    /**
     * 连接回调，通知连接上或重连上
     */
    onopen = () => {
        const _this = this
        this.event.eventMap.forEach((ctxs, methodName) => {
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
     * @mode 模式1:多id或者methodName名称传入-off('onid1')、off('onid1','getData'...)
     * @mode 模式2:on方法传入的methodName和方法-off('getData',fun)
     * @param uids-传入的是id或者methodName加方法清理的是methodName的单个注册，传入的是methodName清理methodName所有注册
     */
    off = (...uids: any[]) => {
        uids.filter((_el) => _el.indexOf(this.event.tag) === -1).forEach((methodName) => {
            this.signalrbean.connection.off(methodName)
        })
        this.event.off(...uids)
    }

    /**
     * 清空所有回调
     */
    clear = () => {
        this.event.clear()
    }
}
