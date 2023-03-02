import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * Axios封装类
 * @param 封装了请求方式，文件下载，消息类型，参数处理
 * @param 使用 -get、post、delete、put方法都可以使用两种传参方式
 * @param 一：只传地址，默认使用相应的请求方式；二：传入参数对象
 * @example 
 *  const http = new AxiosBean({
        baseUrl: '/',
        outtime: 3000
    })

    //get
    let res = await http.get('/list')
    res = await http.get('/list',{token:'123'})
    //将get请求转为post请求使用
    res = await http.get({ url:'/list',method:'post'},{token:'123'})

    //post
    let res = await http.post('/list')
    res = await http.post('/list',{token:'123'})
    //将post请求转为get请求使用
    res = await http.post({ url:'/list',method:'get'},{token:'123'})
    
    //下载文件
    http.post({ url:'/list',method:'post'，responseType: 'blob'})
    //如果下载文件的文件名需要操作，在创建AxiosBean传入setFileName进行修改

    //delete和put同理
 */
export default class AxiosBean {
    http: AxiosInstance

    constructor(param: {
        baseUrl: string
        /**
         * 请求前处理
         * @param config
         * @returns
         */
        req?: (config: InternalAxiosRequestConfig) => void
        /**
         * 请求后处理
         * @param config
         * @returns
         */
        res?: (res: AxiosBeanRes) => any
        /**
         * 错误处理
         * @param res
         * @returns
         */
        error?: (res: AxiosBeanRes) => any
        /**
         * 设置文件下载时的文件名称
         * @param res
         * @returns
         */
        setFileName?: (res: AxiosResponse<any, any>) => string
        /**
         * 超时时间
         */
        outtime?: number
    }) {
        this.http = axios.create({
            baseURL: param.baseUrl,
            timeout: param.outtime ?? 30000
        })

        this.http.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                config.headers['Accept'] = '*/*'
                if (param.req) param.req(config)
                return config
            },
            (error: any) => {
                return Promise.reject(error)
            }
        )

        this.http.interceptors.response.use(
            (response: AxiosResponse<any, any>): any => {
                if (response.headers['content-disposition'] !== undefined) {
                    let fileName = 'download'
                    try {
                        if (param.setFileName) fileName = param.setFileName(response)
                        else {
                            fileName = response.headers['content-disposition'].split('filename*=')[1]
                            fileName = decodeURI(fileName.split("'")[2])
                        }
                    } catch {}
                    try {
                        let url = URL.createObjectURL(response.data)
                        let a = document.createElement('a')
                        a.href = url
                        a.setAttribute('download', fileName)
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                    } catch {}
                    return {
                        status: true
                    }
                }
                let res: AxiosBeanRes = response.data
                if (res.code) {
                    res.code += ''
                    if (res.status === undefined) res.status = res.code === '200'
                }
                if (param.res) param.res(res)
                return res
            },
            (error) => {
                param.error ? param.error(error) : 0
                return { status: false }
            }
        )
    }

    /**
     * 获取请求-一般不用这个方法
     * @param request
     * @param data
     * @param method
     * @returns
     * @example
     * getHttp<T>('/data',{} 'get')
     */
    httpHandle<T = any>(request: AxiosRequestConfig | string, data: any, method: string): Promise<AxiosBeanRes<T>> {
        if (typeof request !== 'string') method = request.method ?? method
        return new Promise<AxiosBeanRes<T>>((resolve, reject) => {
            if (typeof request === 'string') {
                request = {
                    url: request
                }
            }
            let params = ['get', 'delete', 'head'].indexOf(method) > -1 ? { params: data } : { data: data }
            this.http({
                ...request,
                ...params
            }).then(
                (response: any) => {
                    resolve(response)
                },
                (err: any) => {
                    reject(err)
                }
            )
        })
    }

    get<T = any>(request: AxiosRequestConfig | string, data: any = {}): Promise<AxiosBeanRes<T>> {
        return this.httpHandle<T>(request, data, 'get')
    }

    post<T = any>(request: AxiosRequestConfig | string, data: any = {}): Promise<AxiosBeanRes<T>> {
        return this.httpHandle<T>(request, data, 'post')
    }

    delete<T = any>(request: AxiosRequestConfig | string, data: any = {}): Promise<AxiosBeanRes<T>> {
        return this.httpHandle<T>(request, data, 'delete')
    }

    put<T = any>(request: AxiosRequestConfig | string, data: any = {}): Promise<AxiosBeanRes<T>> {
        return this.httpHandle<T>(request, data, 'put')
    }
}

export interface AxiosBeanRes<T = any> {
    /**
     * 消息代码
     */
    code: string
    /**
     * 消息状态，code是200时为true，其他为false，如果返回了该字段则不进行处理
     */
    status: boolean
    /**
     * 使用消息字段1
     */
    message: string
    /**
     * 使用消息字段2
     */
    msg: string
    /**
     * 请求返回数据
     */
    data: T
    /**
     * 数组长度
     */
    total: number
    /**
     * 附带信息字段1
     */
    tag: string
    /**
     * 附带信息字段2
     */
    uuid: string
}
