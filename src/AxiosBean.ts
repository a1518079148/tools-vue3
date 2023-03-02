/* eslint-disable no-unused-vars */
import axios, { AxiosInstance } from 'axios'

export default class AxiosBean {
    http: AxiosInstance

    constructor(param: {
        baseUrl: string
        req?: (config: any) => void
        res?: (res: Res) => any
        error?: (res: Res) => any
        outtime?: number
    }) {
        this.http = axios.create({
            baseURL: param.baseUrl,
            timeout: param.outtime ?? 40000
        })

        this.http.interceptors.request.use(
            async (config: any) => {
                config.headers['Accept'] = '*/*'
                if (param.req) param.req(config)
                return config
            },
            (error: any) => {
                return Promise.reject(error)
            }
        )

        this.http.interceptors.response.use(
            (response): any => {
                let res: Res = response.data
                if (res.code) res.status = res.code + '' === '200'
                if (param.res) param.res(res)
                return res
            },
            (error) => {
                param.error ? param.error(error) : 0
                return { status: false }
            }
        )
    }

    get<T = any>(request: any, data: any = {}): Promise<Res<T>> {
        return new Promise<Res<T>>((resolve, reject) => {
            let method = request.method,
                params = ['get', 'delete', 'head'].indexOf(method) > -1 ? { params: data } : { data: data }
            this.http({
                ...request,
                ...params
            }).then(
                (response: any) => {
                    resolve(<Res<T>>response)
                },
                (err: any) => {
                    reject(<Res<T>>err)
                }
            )
        })
    }
}

export interface Res<T = any> {
    code: string
    status: boolean
    message: string
    data: T
}
