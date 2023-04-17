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
Scope.onFun('n', () => {
    console.log('T1')
})

const conf = reactive({
    name: 'T1'
})

Scope.createObj('conf', () => {
    return conf
})
</script>
<style lang="less" scoped></style>
