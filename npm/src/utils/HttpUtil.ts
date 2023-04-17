import { AxiosBean, AxiosBeanRes } from 'tools-vue3'
import Config from './Config'
import System from './System'
export default class HttpUtil {
    static async init() {
        /**
         * 请求前处理
         * @param config
         */
        const req = (config: any) => {
            config.headers['token'] = 'Bearer ' + System.store.user.token

            //设置额外参数
            const params = ['get', 'delete', 'head'].indexOf(config.method) > -1 ? 'params' : 'data'
            config[params].version = '1.0.0'
        }

        /**
         * 请求后处理
         * @param res
         * @returns
         */
        const res = (res: AxiosBeanRes) => {
            if (res.status) {
                if (res.message) System.sr(res.message)
                return res
            } else {
                if (res.message) System.er(res.message)
                let code = res.code + ''
                switch (code) {
                    case '304':
                        return res
                    default:
                        break
                }
            }
            return res
        }

        const errorObj: { [key: string]: { time: number; text: any } } = {}
        const error = (e: any) => {
            const err = e.message
            if (err.indexOf('Network Error') != -1) {
                let errorCtxTemp: any = null
                if (err.indexOf('timeout') != -1) errorCtxTemp = '请求超时'
                else if (err.indexOf('404') != -1) errorCtxTemp = '不存在该接口'
                else if (err.indexOf('401') != -1) errorCtxTemp = '无操作权限'
                else errorCtxTemp = '网络异常'
                const thistime = new Date().getTime()
                if (errorObj[errorCtxTemp] == undefined)
                    errorObj[errorCtxTemp] = {
                        time: thistime - 4000,
                        text: errorCtxTemp
                    }
                let logTime = thistime - errorObj[errorCtxTemp].time
                if (logTime > 3000) {
                    System.er(errorCtxTemp)
                    errorObj[errorCtxTemp].time = thistime
                }
            }
        }

        System.http = new AxiosBean({
            baseUrl: Config.api,
            req,
            res,
            error,
            outtime: Config.outtime
        })
    }
}
