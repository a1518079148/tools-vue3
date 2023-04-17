<template>
    <div>404页面</div>
    <sicon type="plus" @click="toHome" />
</template>

<script lang="ts" setup>
import System from '~/utils/System'

const toHome = () => {
    System.router.push('/')
}
</script>
<style lang="less" scoped></style>
