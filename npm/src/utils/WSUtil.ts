import { WebSocketBean } from 'tools-vue3'
export default class WSUtil {
    static ws: WebSocketBean
    static async init() {
        const sendSuffix = ''
        this.ws = new WebSocketBean({
            url: 'ws://192.168.1.66:8801/ws',
            needReconnect: true,
            reconnectGapTime: 3000,
            onerror: () => {
                console.log('断开')
            },
            sendSuffix,
            messageSuffix: sendSuffix,
            heartSend: '~',
            heartGet: '~',
            heartGapTime: 3000,
            onmessage: (data) => {
                console.log(data.data)
                const sp = data.data.split(sendSuffix).filter((el: string) => el.length > 0)
                console.log(sp)
            }
        })
    }
}
