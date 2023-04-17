export default class ListUtil {
    /**
     * 将存在id和pid字段的数组转树，当某个对象不存在字段时不会转换该对象
     * @param data
     * @returns
     */
    static toTree = (data: any) => {
        // 空数组
        let result: any = []
        // 判断不是数组  直接返回
        if (!Array.isArray(data)) {
            return result
        }
        // 遍历  删除  children 属性  做初始化操作
        data.forEach((item) => {
            if (item.id) delete item.children
        })
        //  空对象
        let map: any = {}
        data.forEach((item) => {
            if (item.id) map[item.id] = item
        })

        /**
         * map对象的 键: 是每个id  值：对应的item
         * 1: {id: 1, pid: 0, name: "body"}
         * 2: {id: 2, pid: 1, name: "title"}
         * 3: {id: 3, pid: 2, name: "div"}
         */
        data.forEach((item) => {
            // item.pid 为0时 返回underfined
            let parent = map[item.pid]
            if (parent) {
                ;(parent.children || (parent.children = [])).push(item)
            } else {
                // 这里push的item是pid为0的数据
                result.push(item)
            }
        })
        return result
    }
}
