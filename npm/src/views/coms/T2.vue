<template>
    <div>
        {{ name }}
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import Scope from '~/utils/Scope'

defineProps({
    name: { default: '' }
})
const conf = reactive({
    name: 'T2'
})
Scope.onFun('n', () => {
    console.log('T2')
})
Scope.createObj('conf1', () => {
    return conf
})
Scope.createObj('conf', () => {
    return conf
})
</script>
<style lang="less" scoped></style>
