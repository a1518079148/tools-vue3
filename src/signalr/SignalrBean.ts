import * as signalR from '@microsoft/signalr'
import ObjectUtil from '../ObjectUtil'
import { ISignalrBean, ISignalrBeanParam, ISignalrMessage, ISignalrSend } from './signalr'
import { SignalrStatusEnum } from './SignalrEnum'
import SignalrMessage from './SignalrMessage'
import SignalrSend from './SignalrSend'

/**
 * Signalr封装
 */
export default class SignalrBean implements ISignalrBean {
    status: SignalrStatusEnum = null as any
    connection: signalR.HubConnection = null as any
    param: ISignalrBeanParam = null as any
    sendObj: ISignalrSend = null as any
    messageObj: ISignalrMessage = null as any

    constructor(param: ISignalrBeanParam) {
        this.param = param
        this.create()
    }

    /**
     * 打开连接
     */
    onopen = async () => {
        //修改状态为已连接
        this.status = SignalrStatusEnum.open

        if (this.param.onopen) await this.param.onopen()
        this.messageObj.onopen()
        this.sendObj.onopen()
    }

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     */
    send(methodName: string | { methodName: string; resend: boolean }, ...args: any[]) {
        let resend = false
        if (ObjectUtil.isObject(methodName)) {
            resend = methodName.resend ?? resend
            methodName = methodName.methodName
        }
        return this.sendObj?.send(
            {
                methodName,
                args
            },
            resend
        )
    }

    /**
     * 发送当前需要重新发送的消息
     */
    resend = () => {
        this.sendObj.onopen()
    }

    /**
     * 销毁需要重发的数据信息
     * @param sendId
     */
    offsend = (sendId: string) => {
        this.sendObj?.offsend(sendId)
    }

    /**
     * 注册数据回调
     * @param methodName
     * @param fun
     * @returns
     */
    on = (methodName: string, fun: (data: any) => any) => {
        return this.messageObj.on(methodName, fun)
    }

    /**
     * @mode 模式1:多id或者methodName名称传入-off('onid1')、off('onid1','getData'...)
     * @mode 模式2:on方法传入的methodName和方法-off('getData',fun)
     * @param uids-传入的是id或者methodName加方法清理的是methodName的单个注册，传入的是methodName清理methodName所有注册
     */
    off = (...uids: any[]) => {
        this.messageObj.off(...uids)
    }

    /**
     * 清空所有消息回调
     */
    clear = () => {
        this.messageObj.clear()
    }

    timeoutTimer = null as any

    create = async (param?: ISignalrBeanParam) => {
        this.timeoutTimer = null

        //使用新配置或者老配置
        if (param) this.param = param
        else param = this.param

        //修改状态为加载中
        this.status = SignalrStatusEnum.load

        const signalRBuilder = new signalR.HubConnectionBuilder()
        if (param.isReconnect) {
            if (param.reconnectConfig) signalRBuilder.withAutomaticReconnect(param.reconnectConfig as any)
            else signalRBuilder.withAutomaticReconnect()
        }

        if (param.options) signalRBuilder.withUrl(`${param.url}`, param.options)
        else signalRBuilder.withUrl(`${param.url}`)

        //创建对象
        this.connection = signalRBuilder.build()

        //注册关闭回调
        this.connection.onclose(() => {
            console.log('onclose')
            if (param?.onclose) param.onclose()
            //修改状态为已关闭
            this.status = SignalrStatusEnum.close
        })

        this.connection.onreconnecting(() => {
            console.log('onreconnecting')
            //修改状态为已关闭
            this.status = SignalrStatusEnum.close
        })

        //注册重连成功后的回调
        this.connection.onreconnected((connectionId: any) => {
            console.log('onreconnected')
            this.onopen()
        })

        //创建发送数据管理对象
        if (this.sendObj === null) this.sendObj = new SignalrSend(this)

        //创建发送数据管理对象
        if (this.messageObj === null) this.messageObj = new SignalrMessage(this)

        //连接
        try {
            await this.connection.start()
            this.onopen()
        } catch (err) {
            if (this.connection.state === signalR.HubConnectionState.Disconnected) {
                //第一次失败就继续连接，之后不走这里进行重连
                if (this.timeoutTimer !== undefined)
                    this.timeoutTimer = setTimeout(() => {
                        this.timeoutTimer = null
                        this.create()
                    }, 5000)
            }
        }
    }

    dispose = () => {
        if (this.connection) {
            this.connection.stop()
            this.connection = null as any
        }
        if (this.sendObj) {
            this.sendObj.clear()
            this.sendObj = null as any
        }
        clearTimeout(this.timeoutTimer)
        this.timeoutTimer = undefined
    }
}
