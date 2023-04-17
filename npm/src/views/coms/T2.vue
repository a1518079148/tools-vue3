<template>
    <div>
        {{ name }}
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Scope } from 'tools-vue3'
const { onFun, createObj } = Scope

defineProps({
    name: { default: '' }
})
const conf = reactive({
    name: 'T2'
})
onFun('n', () => {
    console.log('T2')
})
createObj('conf1', () => {
    return conf
})
createObj('conf', () => {
    return conf
})
</script>
<style lang="less" scoped></style>
