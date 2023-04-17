<template>
    <div>
        {{ name }}
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Scope } from 'tools-vue3'
const { getFun, useObj } = Scope

defineProps({
    name: { default: '' }
})
const { emitFun } = getFun('n')
const conf = useObj('conf')
const conf1 = useObj('conf1')
const conf2 = useObj('conf')
const conf3 = useObj('conf', 2)

onMounted(() => {
    emitFun('T3')
    console.log(conf)
    console.log(conf1)
    console.log('conf2', conf2)
    console.log('conf3', conf3)
})
</script>
<style lang="less" scoped></style>
