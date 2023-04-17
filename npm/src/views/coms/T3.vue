<template>
    <div>
        {{ name }}
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Scope from '~/utils/Scope'

defineProps({
    name: { default: '' }
})
const { emitFun } = Scope.getFun('n')
const conf = Scope.useObj('conf')
const conf1 = Scope.useObj('conf1')
const conf2 = Scope.useObj('conf')
const conf3 = Scope.useObj('conf', 2)

onMounted(() => {
    emitFun('T3')
    console.log(conf)
    console.log(conf1)
    console.log('conf2', conf2)
    console.log('conf3', conf3)
})
</script>
<style lang="less" scoped></style>
