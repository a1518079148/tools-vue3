import { createRouter, createWebHashHistory } from 'vue-router'
import ListUtil from '~/utils/ListUtil'
import System from '~/utils/System'
import baseRouterList from './baseRouterList'
import routesComs from './routerComs'

//组件对象 名称->组件
const coms: any = routesComs

const cp = (obj: any) => {
    if (obj) return JSON.parse(JSON.stringify(obj))
    else return obj
}

const setCom = (obj: any) => {
    if (obj.component) {
        obj.component = coms[obj.component]
    }
    if (obj.children) {
        obj.children = obj.children.map((item: any) => setCom(item))
    }
    return obj
}

const getRouterBaseList = () => {
    let routerArr = cp(baseRouterList)
    routerArr = routerArr.map((item: any) => setCom(item))
    return routerArr
}

const initRouter = (list?: any[]) => {
    const routes = [
        ...getRouterBaseList(),
        {
            path: '/:matchOthers(.*)*',
            component: () => import('~/views/404/index.vue')
        }
    ]

    if (System.router == null) {
        //初始化路由
        const router = createRouter({
            history: createWebHashHistory(),
            routes
        })
        router.beforeEach(async (to, from, next) => {
            next()
        })
        System.router = router
    } else {
        const router = System.router
        if (list) {
            list = cp(list)
            //将路由列表转路由树
            const addRouterList: any[] = ListUtil.toTree(list)
            //清空路由，只留下基础路由
            router.getRoutes().forEach((item) => {
                if (item.name) {
                    if (baseRouterList.findIndex((el) => el.name === item.name) < 0) {
                        router.removeRoute(item.name)
                    }
                }
            })
            //添加新路由
            addRouterList.forEach((item) => {
                router.addRoute(setCom(item))
            })
        }
    }

    return System.router
}

const clearRouter = () => {
    initRouter([])
}

export type RouterComName = keyof typeof routesComs

export { initRouter, clearRouter }
