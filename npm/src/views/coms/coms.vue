<template>
    <div>
        父级
        <RouterView />
        <T1 name="容器1">
            <T2 name="容器2">
                <T3 name="容器3">内容</T3>
            </T2>
        </T1>
    </div>
</template>

<script lang="ts" setup>
import T1 from './T1.vue'
import T2 from './T2.vue'
import T3 from './T3.vue'
</script>
<style lang="less" scoped></style>
