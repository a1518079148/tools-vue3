import ObjectUtil from '../ObjectUtil'
import { IWebSocketBean } from './websocket'
import { WebSocketStatusEnum } from './WebSocketStatusEnum'

/**
 * WebSocket数据发送管理
 */
export default class WebSocketSend {
    websocketbean: IWebSocketBean

    constructor(websocketbean: IWebSocketBean) {
        this.websocketbean = websocketbean
    }

    /**
     * 临时发送管理对象
     */
    sendTemp: { tag: string; data: any; resend: boolean }[] = []

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
            //先判断是不是缓存待发送的数据，如果是取出待发送的数据和状态
            if (ObjectUtil.isObject(data)) {
                if (data.tag === this.tag) {
                    data = data.data
                    resend = data.resend
                }
            }

            //如果需要重发就保存起来
            let sendId = null
            if (resend) {
                sendId = this.getSendId()
                this.sendMap[sendId] = data
            }

            //判断是不是对象或者数组，转换为字符串
            if (ObjectUtil.isObject(data) || Array.isArray(data)) {
                data = JSON.stringify(data)
            }

            //发送数据
            this.websocketbean.websocket.send(data)

            //如果是需要重发的返回sendId
            return resend ? true : sendId
        } else {
            if (ObjectUtil.isObject(data)) {
                //说明是缓存待发送数据，不做处理
                if (data.tag === this.tag) return false
            }

            //未连接上时存入临时缓存，连上后发送
            this.sendTemp.push({
                tag: this.tag,
                data,
                resend
            })

            return false
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
            if (sendStatus) this.sendTemp.splice(i, 1)
        }
    }
}
