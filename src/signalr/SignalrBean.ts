import signalR from '@microsoft/signalr'
import ObjectUtil from '../ObjectUtil'
import { ISignalrBean, ISignalrBeanParam, ISignalrSend } from './signalr'
import { SignalrStatusEnum } from './SignalrEnum'
import SignalrSend from './SignalrSend'

/**
 * Signalr封装
 */
export default class SignalrBean implements ISignalrBean {
    status: SignalrStatusEnum = null as any
    connection: signalR.HubConnection = null as any
    param: ISignalrBeanParam = null as any
    sendObj: ISignalrSend = null as any

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
     * 销毁需要重发的数据信息
     * @param sendId
     */
    offsend = (sendId: string) => {
        this.sendObj?.offsend(sendId)
    }

    create = async (param?: ISignalrBeanParam) => {
        //使用新配置或者老配置
        if (param) this.param = param
        else param = this.param

        //修改状态为加载中
        this.status = SignalrStatusEnum.load

        //创建对象
        this.connection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(`${param.url}`, { headers: param.headers })
            .build()

        //注册关闭回调
        this.connection.onclose(() => {
            console.log('onclose')
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

        //连接
        const startState = await this.connection.start()

        console.log(startState)

        this.onopen()
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
    }
}
