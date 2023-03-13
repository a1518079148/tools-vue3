# vue3 ts 工具类
> 提供vue3导出工具，不引用不会进行打包，减小项目应用体积和方便项目版本管理，导出以下工具
```
{
    CVue3,
    CookieUtil,
    ObjectUtil,
    TimeUtil,
    FileUtil,
    AxiosBean,
    WebSocketBean,
    SignalrBean,
    type AxiosBeanRes,
    DateType
}

```

> 前端技术交流群：<a href="https://jq.qq.com/?_wv=1027&k=Erh7LBKn" target="_blank">553655769</a>，有什么问题在群里说不定可以找到答案


> 开源仓库，欢迎提交更多功能，方便他人，方便自己
> - <a href="https://gitee.com/veigarchen/tools-vue3" target="_blank">gitee主仓库地址</a>
> - <a href="https://github.com/a1518079148/tools-vue3" target="_blank">github同步仓库地址</a>

## 安装使用

### 安装
```
pnpm i tools-vue3
```
### 使用

- 在需要使用的文件直接导入即可

## CVue3
```bash
操作Vue3的工具，如生命周期等 
```

- 使用：
```
import { CVue3 } from 'tools-vue3'

CVue3.onDispose(()=>{
    console.log('unmounted')
})
```

## CookieUtil
```bash
缓存工具，对局域网和公网进行缓存，cookie和localStorage利用
```

- 使用：
```
import { CookieUtil } from 'tools-vue3'

//设置cookie
CookieUtil.set('name','user1')

//获取cookie
const name = CookieUtil.get('name')
console.log(name)

```

## ObjectUtil
```bash
类型判断工具，如Object，Set，Map，Promise等类型
```

- 使用：
```
import { ObjectUtil } from 'tools-vue3'


const isObject = ObjectUtil.isObject({name:1})
console.log(isObject)
```

## FileUtil
```bash
文件请求工具，访问如http://xxx.com/data.json等文件
```

- 使用：
```
import { FileUtil } from 'tools-vue3'

//项目地址
const res = await FileUtil.getFile('conf.json')
console.log(res)

//网络地址
const res1 = await FileUtil.getFile('http://test.com/conf.json')
console.log(res1)
```

## AxiosBean
```bash
axios封装工具，使用更方便
```

- 使用：
```
import { AxiosBean,AxiosBeanRes } from 'tools-vue3'

const http = new AxiosBean({
    baseUrl: Config.api,
    req:(config: any) => {
        //设置headers信息
        config.headers['Authorization'] = 'Bearer ' + 'tokenjwt'

        //设置额外参数
        const params = ['get', 'delete', 'head'].indexOf(config.method) > -1 ? 'params' : 'data'
        config[params].version = '1.0.0'
    },
    res:(res: AxiosBeanRes) => {
        //对json数据进行处理
        switch (res.code) {
            case '401':
                console.log('无效的权限信息')
            default:
                break
        }
        return res
    },
    error:(e: any) => {
        const err = e.message
        if (err.indexOf('Network Error') != -1) {
            console.log('网络错误')
        }
    },
    outtime: 30000
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

```

## WebSocketBean
```bash
WebSocket封装工具，提供心跳，重连，重连重发，生命周期管理等
```

- 使用：
```
import { WebSocketBean } from 'tools-vue3'

const ws = new WebSocketBean({
    url:'c44.cc/ws'
})
```

## SignalrBean
```bash
Signalr封装工具，提供心跳，重连，重连重发，生命周期管理等
```
- 使用：
```
import { SignalrBean } from 'tools-vue3'

//创建连接
const ws = new SignalrBean({
    url: 'c44.cc/ws',
    onopen: () => {
        return new Promise(async (res) => {
            console.log('连接成功')
            res(true)
        })
    },
    isReconnect: true,
    reconnectConfig: {
        nextRetryDelayInMilliseconds: (retryContext) => {
            return 3000
        }
    },
    options: {
        // headers: { Authorization: token },
        // accessTokenFactory: () => token
    }
})

//销毁
ws.dispose()

//发送数据
ws.send('SubData','test')

//注册接收数据
const onid = ws.on('GetSubData', (res: any) => {
    console.log(res)
})

//销毁接收数据-通过onid
ws.off(onid)
//销毁接收数据-通过注册名称
ws.offName('GetSubData')

//需要在重新连接后自动再次发送数据
const sendid = ws.send({
    methodName: 'SubData',
    resend: true
},'test')

//销毁再次发送数据
ws.offsend(sendid)

```