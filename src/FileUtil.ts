import axios from 'axios'

/**
 * 文件请求工具
 */
export default class FileUtil {
    /**
     * 获取读取文件函数
     * @param param -baseUrl-获取文件根地址，默认为/，outtime-超时时间，默认为30000
     * @returns
     */
    static getFileFun = (param?: { baseUrl: string; outtime: number }) => {
        const defaultObj = { baseUrl: '/', outtime: 30000 }
        let paramObj = param ?? defaultObj
        const fun = (url: string): Promise<any> => {
            let resarr: any[] = []
            Array.from(/([^http(s+)://][^\/]*)\//[Symbol.matchAll](url)).forEach((item: any) => {
                item.baseUrl = item.input.substring(0, item.index) + item[1]
                item.url = item.input.substring(item.baseUrl.length)
                resarr.push(item)
            })
            return new Promise((pres) => {
                let baseUrl = resarr.length > 0 ? resarr[0].baseUrl : paramObj.baseUrl
                url = resarr.length > 0 ? resarr[0].url : url
                axios
                    .create({
                        baseURL: baseUrl ?? defaultObj.baseUrl,
                        timeout: paramObj.outtime ?? defaultObj.outtime
                    })
                    .get(url)
                    .then((res) => {
                        pres(res.data)
                    })
                    .catch(() => {
                        pres(undefined)
                    })
            })
        }
        return fun
    }

    /**
     * 获取文件内容
     * @param url
     * @returns
     */
    static getFile = (url: string): Promise<any> => {
        return this.getFileFun()(url)
    }
}
