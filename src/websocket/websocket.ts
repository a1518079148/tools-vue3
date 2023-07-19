import { WebSocketStatusEnum } from './WebSocketEnum'
export interface IWebSocketBean {
    /**
     * 连接状态
     */
    status: WebSocketStatusEnum

    /**
     * WebSocket对象
     */
    websocket: WebSocket

    /**
     * 心跳对象
     */
    heart: IWebSocketHeart

    /**
     * 重连对象
     */
    reconnect: IWebSocketReconnect

    /**
     * 发送对象
     */
    sendObj: IWebSocketSend

    /**
     * 参数信息
     */
    param: IWebSocketBeanParam

    /**
     * 关闭旧连接创建新连接
     * @param param
     * @returns
     */
    start: (param?: IWebSocketBeanParam) => void

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     * @param resend 是否需要在重新连上以后再次发送该数据
     */
    send(data: any, resend?: boolean): string | boolean

    /**
     * 销毁需要重发的数据信息
     * @param sendId
     */
    offsend: (sendId: string) => void

    /**
     * 异常操作绑定
     */
    onerror: () => void

    /**
     * 关闭socket，销毁绑定事件、心跳事件、窗口关闭事件，修改状态为已关闭
     */
    close: () => void

    /**
     * 销毁所有对象
     */
    dispose: () => void
}

/**
 * 参数信息
 */
export interface IWebSocketBeanParam {
    /**
     * 连接地址
     */
    url: string

    /**
     * 发送消息前缀，默认为空
     */
    sendPrefix?: string

    /**
     * 发送消息后缀，默认为空
     */
    sendSuffix?: string

    /**
     * 接收消息前缀，默认为空
     */
    messagePrefix?: string

    /**
     * 接收消息后缀，默认为空
     */
    messageSuffix?: string

    /**
     * 生命周期-在建立连接以后首先调用
     */
    onopen?: () => Promise<any>

    /**
     * 生命周期-在获取到数据以后首先调用
     */
    onmessage?: (ev: MessageEvent<any>) => any

    /**
     * 生命周期-在关闭或者连接异常以后首先调用
     */
    onerror?: () => void

    /**
     * 生命周期-在重连开始以后首先调用
     */
    onreconnect?: () => void

    //重连参数列表

    /**
     * 最大重连次数，默认为10次
     */
    reconnectMaxNum?: number

    /**
     * 重连间隔时间，默认为30000
     */
    reconnectGapTime?: number

    /**
     * 是否需要重连，默认为false
     */
    needReconnect?: boolean

    /**
     * 重连失败通知
     */
    onFailReconnect?: () => void

    //心跳参数列表

    /**
     * 心跳发送内容，默认为heartSend
     */
    heartSend?: string

    /**
     * 心跳接收内容，默认为heartGet
     */
    heartGet?: string

    /**
     * 心跳发送间隔时间，默认为30000
     */
    heartGapTime?: number

    /**
     * 心跳无响应上限，默认为10
     */
    heartFailNum?: number
}

/**
 * 心跳
 */
export interface IWebSocketHeart {
    /**
     * 心跳发送内容，默认为heartSend
     */
    heartSend: string

    /**
     * 心跳接收内容，默认为heartGet
     */
    heartGet: string

    /**
     * 心跳发送间隔时间，默认为30000
     */
    heartGapTime: number

    /**
     * 心跳无响应次数
     */
    failNum: number

    /**
     * 心跳无响应上限，默认为10
     */
    heartFailNum: number

    /**
     * WebSocketBean对象
     */
    websocketbean: IWebSocketBean

    /**
     * 获取心跳信息
     * @param ev
     * @returns
     */
    onmessage: (ev: any) => any
}

/**
 * 重连
 */
export interface IWebSocketReconnect {
    /**
     * 开启状态
     */
    status: boolean
    /**
     * WebSocketBean对象
     */
    websocketbean: IWebSocketBean

    /**
     * 当前重连次数
     */
    num: number

    /**
     * 最大重连次数，默认为10次
     */
    reconnectMaxNum: number

    /**
     * 重连间隔时间
     */
    reconnectGapTime: number

    /**
     * 开始尝试重连
     */
    start: () => void

    /**
     * 关闭重连
     */
    stop: () => void
}

/**
 * 发送数据管理
 */
export interface IWebSocketSend {
    /**
     * WebSocketBean对象
     */
    websocketbean: IWebSocketBean

    /**
     * 发送信息前缀
     */
    sendPrefix: string

    /**
     * 发送信息后缀
     */
    sendSuffix: string

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     */
    send(data: any, resend?: boolean): string | boolean

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
