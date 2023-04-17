<template>
    <div>
        {{ name }}
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import Scope from '~/utils/Scope'
const { onFun, createObj } = Scope

defineProps({
    name: { default: '' }
})

onFun('n', () => {
    console.log('T1')
})

const conf = reactive({
    name: 'T1'
})

createObj('conf', conf)
</script>
<style lang="less" scoped></style>
