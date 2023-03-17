import { IWebSocketBean, IWebSocketSend } from './websocket'
import { WebSocketStatusEnum } from './WebSocketEnum'

const isObject = (val: any): any => val !== null && typeof val === 'object'

/**
 * WebSocket数据发送管理
 */
export default class WebSocketSend implements IWebSocketSend {
    websocketbean: IWebSocketBean

    sendPrefix: string
    sendSuffix: string

    constructor(websocketbean: IWebSocketBean) {
        this.websocketbean = websocketbean
        this.sendPrefix = this.websocketbean.param.sendPrefix ?? ''
        this.sendSuffix = this.websocketbean.param.sendSuffix ?? ''
    }

    /**
     * 临时发送管理对象
     */
    sendTemp: { tag: string; data: any; resend: boolean; sendId?: string }[] = []

    /**
     * 重新发送id
     */
    sendId: number = 1000

    /**
     * 获取重新发送id
     * @returns
     */
    getSendId = () => {
        this.sendId++
        return this.sendId + ''
    }

    /**
     * 缓存数据标识
     */
    tag = '___senTemp'

    /**
     * 重新发送的数据管理
     */
    sendMap: { [key: string]: any } = {}

    /**
     * 发送数据
     * @param data 数据对象，Object、Array、String
     */
    send(data: any, resend: boolean = false) {
        if (this.websocketbean.status === WebSocketStatusEnum.open) {
            let sendId: string = null as any

            //先判断是不是缓存待发送的数据，如果是取出待发送的数据和状态
            if (isObject(data)) {
                if (data.tag === this.tag) {
                    resend = data.resend
                    //如果resend是true，sendId一定存在
                    if (resend) sendId = data.sendId
                    data = data.data
                }
            }

            //如果需要重发就保存起来
            if (resend) {
                if (sendId === null) sendId = this.getSendId()
                this.sendMap[sendId] = data
            }

            //判断是不是对象或者数组，转换为字符串
            if (isObject(data) || Array.isArray(data)) {
                data = JSON.stringify(data)
            }

            //发送数据
            this.websocketbean.websocket.send(this.sendPrefix + data + this.sendSuffix)

            //如果是需要重发的返回sendId
            return resend ? sendId : true
        } else {
            let sendId: string = null as any

            if (isObject(data)) {
                //说明是缓存待发送数据，不做处理
                if (data.tag === this.tag) return false
            }

            //未连接上时存入临时缓存，连上后发送
            const sendTempItem: any = {
                tag: this.tag,
                data,
                resend
            }

            if (resend) {
                sendId = this.getSendId()
                sendTempItem.sendId = sendId
            }
            this.sendTemp.push(sendTempItem)
            return resend ? sendId : false
        }
    }

    /**
     * 销毁需要重发的数据信息
     * @param sendId
     */
    offsend = (sendId: string) => {
        this.sendMap[sendId] = undefined
        delete this.sendMap[sendId]
    }

    /**
     * 通知连接打开
     */
    onopen = () => {
        //处理重发数据
        Object.keys(this.sendMap).forEach((key) => {
            if (this.sendMap[key] !== undefined) this.send(this.sendMap[key])
        })

        //处理临时数据
        for (let i = this.sendTemp.length - 1; i >= 0; i--) {
            const item = this.sendTemp[i]
            const sendStatus = this.send(item)
            if (sendStatus !== false) this.sendTemp.splice(i, 1)
        }
    }

    /**
     * 清空所有缓存数据
     */
    clear = () => {
        this.sendMap = {}
        this.sendTemp = []
    }
}
