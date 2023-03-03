/**
 * WebSocket心跳机制
 */
export default class WebSocketHeart implements IWebSocketHeart {
    websocketbean: IWebSocketBean
    heartSend: string
    heartGet: string
    heartGapTime: number
    failNum: number = 0
    heartFailNum: number

    constructor(websocketbean: IWebSocketBean) {
        this.websocketbean = websocketbean
        this.heartSend = this.websocketbean.param.heartSend ?? 'heartSend'
        this.heartGet = this.websocketbean.param.heartGet ?? 'heartGet'
        this.heartGapTime = this.websocketbean.param.heartGapTime ?? 30000
        this.heartFailNum = this.websocketbean.param.heartFailNum ?? 10
    }

    timer: number = null as any

    start = () => {
        if (this.timer !== null) return
        this.failNum = 0
        this.timer = setInterval(() => {
            if (this.failNum >= this.heartFailNum) {
                this.stop()
                this.websocketbean.onerror()
                return
            }
            this.websocketbean.send(this.heartSend)
            this.failNum++
        }, this.heartGapTime)
    }

    stop = () => {
        clearInterval(this.timer)
        this.timer = null as any
    }

    onmessage = (ev: MessageEvent<any>) => {}
}
