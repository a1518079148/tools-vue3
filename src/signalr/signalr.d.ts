import signalR from '@microsoft/signalr'
import SignalrStatusEnum from './SignalrEnum'
interface ISignalrBean {

    /**
     * 连接状态
     */
    status:SignalrStatusEnum

    /**
     * signalR对象
     */
    connection: signalR.HubConnection

    /**
     * 发送数据管理
     */
    sendObj: ISignalrSend

    /**
     * 参数信息
     */
    param:ISignalrBeanParam

    /**
     * 关闭旧连接创建新连接
     * @param param 
     * @returns 
     */
    create: (param?: ISignalrBeanParam) => void

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     * @param resend 是否需要在重新连上以后再次发送该数据
     */
    send(methodName: string | {
        methodName: string;
        resend: boolean;
    }, ...args: any[]): string | boolean

    /**
     * 销毁需要重发的数据信息
     * @param sendId
     */
    offsend: (sendId: string) => void

    /**
     * 销毁所有对象
     */
    dispose: () => void
}

/**
 * 参数信息
 */
interface ISignalrBeanParam {

    /**
     * 连接地址
     */
    url: string

    /**
     * headers
     */
    headers: any

    /**
     * 生命周期-在建立连接以后首先调用
     */
    onopen?:()=>Promise<any>

    /**
     * 生命周期-在获取到数据以后首先调用
     */
    onmessage?:(ev: MessageEvent<any>) => any

    /**
     * 生命周期-在重连开始以后首先调用
     */
    onreconnect?:()=>void

}

/**
 * 发送数据管理
 */
interface ISignalrSend {
    /**
     * signalrbean对象
     */
    signalrbean: ISignalrBean

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     */
    send(data: { methodName: string; args: any[] }, resend?: boolean): string | boolean

    /**
     * 销毁需要重发的数据信息
     * @param sendId
     */
    offsend: (sendId: string) => void

    /**
     * 通知连接打开
     */
    onopen: () => void

    /**
     * 清空所有缓存数据
     */
    clear: () => void
}

/**
 * 接收数据管理
 */
interface ISignalrMessage {
    /**
     * signalrbean对象
     */
    signalrbean: ISignalrBean
}