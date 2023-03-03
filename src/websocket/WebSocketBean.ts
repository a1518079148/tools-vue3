import WebSocketHeart from './WebSocketHeart'
import WebSocketReconnect from './WebSocketReconnect'

/**
 * WebSocket封装类
 * @param 封装了心跳机制 、重连机制
 */
export default class WebSocketBean implements IWebSocketBean {
    websocket: WebSocket = null as any
    heart: WebSocketHeart = null as any
    reconnect: IWebSocketReconnect = null as any
    param: IWebSocketBeanParam

    constructor(param: IWebSocketBeanParam) {
        this.param = param
        this.create(this.param)
    }

    onopen = () => {
        //调用生命周期
        if (this.param.onopen) this.param.onopen()

        //开启心跳
        this.heart.start()

        //通知连接成功或重连成功
        this.reconnect.stop()
    }

    onmessage = (ev: MessageEvent<any>) => {
        //调用生命周期
        if (this.param.onmessage) this.param.onmessage(ev)

        this.heart.onmessage(ev.data)
    }

    onerror = () => {
        //调用生命周期
        if (this.param.onerror) this.param.onerror()
        //销毁对象
        this.close()
        //开始重连
        this.reconnect.start()
    }

    create = (param?: IWebSocketBeanParam) => {
        //如果已经创建先关闭
        this.close()

        //使用新配置或者老配置
        if (param) this.param = param
        else param = this.param

        //创建连接
        this.websocket = new WebSocket(param.url)

        //绑定连接成功事件
        this.websocket.onopen = this.onopen
        //绑定消息接收事件
        this.websocket.onmessage = this.onmessage
        //绑定连接异常事件
        this.websocket.onerror = this.onerror
        //绑定连接关闭事件
        this.websocket.onclose = this.onerror

        //创建心跳
        this.heart = new WebSocketHeart(this)

        //创建重连，只存在一个重连对象，如果存在则跳过
        if (this.reconnect === null) this.reconnect = new WebSocketReconnect(this)

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.addEventListener('beforeunload', this.close)
    }

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     */
    send(data: any) {
        if ((data !== null && typeof data === 'object') || Array.isArray(data)) {
            data = JSON.stringify(data)
        }
        this.websocket.send(data)
    }

    close = () => {
        if (this.websocket === null) return
        window.removeEventListener('beforeunload', this.close)
        //销毁绑定事件，关闭socket
        if (this.websocket) {
            this.websocket.onerror = null
            this.websocket.onmessage = null
            this.websocket.onclose = null
            this.websocket.onopen = null
            this.websocket.close()
            this.websocket = null as any
        }
        //销毁心跳事件
        if (this.heart) {
            this.heart.stop()
            this.heart = null as any
        }
    }
}
