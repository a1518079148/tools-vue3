import { FileUtil } from 'tools-vue3'
import Theme from '~/styles/Theme'
import { envType } from '../../build/env/globalVar'
import HttpUtil from './HttpUtil'

export default class Config {
    /**
     * 环境变量
     */
    static env: envType = {} as any
    static outtime = 60000

    static init = async (app: any) => {
        Config.env = JSON.parse('#{env}')
        Theme.init()
        await Config.getConfFile()
        await HttpUtil.init()
        app.mount('#app')
    }

    /**
     * http请求地址
     */
    static api: string = '/'
    static apiName = 'API'
    /**
     * websocket请求地址
     */
    static ws: string = '/'
    static wsName = 'WS'

    static config: any = {}

    //获取配置数据
    static getConfFile = () => {
        const env: any = Config.env
        Config.api = env[Config.apiName] ?? Config.api
        Config.ws = env[Config.wsName] ?? Config.api

        return new Promise(async (pres) => {
            if (Config.env.pro) {
                const confurl = '#{confurl}'
                if (confurl.length < 1) {
                    pres(true)
                    return
                }
                const res: any = await FileUtil.getFile(confurl)
                if (res) {
                    Config.config = res
                    Config.api = res[Config.apiName] ?? Config.api
                    Config.ws = res[Config.wsName] ?? Config.api
                    pres(true)
                }
                pres(false)
            } else {
                pres(true)
            }
        })
    }
}
