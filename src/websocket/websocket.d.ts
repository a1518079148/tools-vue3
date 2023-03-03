interface IWebSocketBean {

    /**
     * WebSocket对象
     */
    websocket: WebSocket

    /**
     * 心跳对象
     */
    heart: WebSocketHeart
    
    /**
     * 重连对象
     */
    reconnect: IWebSocketReconnect

    /**
     * 参数信息
     */
    param:IWebSocketBeanParam

    /**
     * 关闭旧连接创建新连接
     * @param param 
     * @returns 
     */
    create: (param?: IWebSocketBeanParam) => void

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     */
    send(data: any): void

    /**
     * 异常操作绑定
     */
    onerror:()=>void
}

interface IWebSocketBeanParam {

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
     * 生命周期-在建立连接以后首先调用
     */
    onopen?:()=>Promise<any>

    /**
     * 生命周期-在获取到数据以后首先调用
     */
    onmessage?:(ev: MessageEvent<any>) => any

    /**
     * 生命周期-在关闭或者连接异常以后首先调用
     */
    onerror?:()=>void

    /**
     * 生命周期-在重连开始以后首先调用
     */
    onreconnect?:()=>void

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
    needReconnect?:boolean 

    /**
     * 重连失败通知
     */
    onFailReconnect?:()=>void

    //心跳参数列表

    /**
     * 心跳发送内容，默认为heartSend
     */
    heartSend?:string

    /**
     * 心跳接收内容，默认为heartGet
     */
    heartGet?:string

    /**
     * 心跳发送间隔时间，默认为30000
     */
    heartGapTime?:number

    /**
     * 心跳无响应上限，默认为10
     */
    heartFailNum?:number
}

/**
 * 心跳
 */
interface IWebSocketHeart {

    /**
     * 心跳发送内容，默认为heartSend
     */
    heartSend:string

    /**
     * 心跳接收内容，默认为heartGet
     */
    heartGet:string

    /**
     * 心跳发送间隔时间，默认为30000
     */
    heartGapTime:number

    /**
     * 心跳无响应次数
     */
    failNum:number

    /**
     * 心跳无响应上限，默认为10
     */
    heartFailNum:number

    /**
     * WebSocketBean对象
     */
    websocketbean: IWebSocketBean

    /**
     * 获取心跳信息
     * @param ev 
     * @returns 
     */
    onmessage:(ev: MessageEvent<any>) => any
}

/**
 * 重连
 */
interface IWebSocketReconnect {
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