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
     * 发送当前需要重新发送的消息
     */
    resend: () => void

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
     * options
     */
    options?: signalR.IHttpConnectionOptions

    /**
     * 生命周期-在建立连接以后首先调用
     */
    onopen?:()=>Promise<any>

    /**
     * 生命周期-断开连接后调用，如果开启了重连，重连失败后调用
     */
    onclose?:()=>Promise<any>

    /**
     * 生命周期-在获取到数据以后首先调用
     */
    onmessage?:(ev: MessageEvent<any>) => any

    /**
     * 生命周期-在重连开始以后首先调用
     */
    onreconnect?: () => void

    //重连
    
    /**
     * 是否需要重连，默认为false
     */
    isReconnect?: boolean
    
    /**
     * 重新连接配置
     */
    reconnectConfig?:number[] | {nextRetryDelayInMilliseconds:(retryContext: signalR.RetryContext)=> number | null}

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
    
    /**
    * 注册数据回调
    * @param methodName
    * @param fun
    * @returns
    */
   on: (methodName: string, fun: (data: any) => any) => string
   
    /**
     * 传入on方法返回的id进行销毁
     * @param uids
     * @returns
     */
    off: (...uids: string[]) => void
    
    /**
     * 传入methodName进行销毁
     * @param uids
     * @returns
     */
    offName: (methodName: string) => void
    
    /**
     * 清空所有回调
     */
    clear: () => void

    /**
     * 连接回调，通知连接上或重连上
     */
    onopen: () => void
}