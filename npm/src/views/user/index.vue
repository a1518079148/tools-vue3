<template>
    <div>用户页</div>
    <sicon type="plus" @click="toHome" />
    <router-view />
</template>

<script lang="ts" setup>
import System from '~/utils/System'

const toHome = () => {
    System.router.push('/')
}
</script>
<style lang="less" scoped></style>
