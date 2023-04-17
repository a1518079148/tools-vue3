<template>
    <div>{{ conf.title }}--主页--{{ conf.name }}</div>
    <sicon type="plus" v-auth="'/api/system/detail'" />
    <sicon type="edit-square" v-auth="'/api/system/edit'" />
    <div>#{title}</div>
    <div class="row" style="gap: 20px; padding: 0px 20px">
        <div class="btn" @click="addRouter">
            <sicon type="plus" />
            添加路由
        </div>
        <div class="btn" @click="clearRouter">
            <sicon type="plus" />
            清空路由
        </div>
        <div class="btn" @click="toUser">
            <sicon type="plus" />
            去用户页
        </div>
        <div class="btn" @click="toUserInfo">
            <sicon type="plus" />
            去用户详情页
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { initRouter } from '~/router'
import routerList from '~/router/routerList'
import System from '~/utils/System'
const conf = reactive({
    title: '测试',
    name: '#{title}--test--#{runtime.pc}'
})
const addRouter = () => {
    initRouter(routerList)
    console.log('添加完毕')
}
const clearRouter = () => {
    initRouter([])
    console.log('清理完毕')
}
const toUser = () => {
    System.router.push('user')
}
const toUserInfo = () => {
    System.router.push('userInfo')
}
</script>
<style lang="less" scoped>
.btn {
    width: 140px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff00080;
    cursor: pointer;
    &:hover {
        border: 1px solid #3ce984;
    }
}
</style>
