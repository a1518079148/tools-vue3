# vue3 ts 工具类
提供vue3导出工具，不引用不会进行打包，减小项目应用体积和方便项目版本管理，导出以下工具
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


## CVue3
```bash
操作Vue3的工具，如生命周期等 
```

## CookieUtil
```bash
缓存工具，对局域网和公网进行缓存，cookie和localStorage利用
```

## ObjectUtil
```bash
类型判断工具，如Object，Set，Map，Promise等类型
```

## FileUtil
```bash
文件请求工具，访问如http://xxx.com/data.json等文件
```

## AxiosBean
```bash
axios封装工具，使用更方便
```

## WebSocketBean
```bash
WebSocket封装工具，提供心跳，重连，重连重发，生命周期管理等
```

## SignalrBean
```bash
Signalr封装工具，提供心跳，重连，重连重发，生命周期管理等
```