<template>
    <!-- 两种情况 -->
    <el-submenu :key="data.id" v-if="data.children">
        <template slot="title">{{data.title}}</template>
        <template v-for="d in data.children">
            <resub :key="d.id" :data="d"></resub>
        </template>
    </el-submenu>
    <el-menu-item :key="data.id" v-else>{{data.title}}</el-menu-item>
</template>

<script>
import elMenuItem from "./el-menu-item";
import elSubmenu from "./el-submenu";
export default {
    name: 'resub', // 递归组件, 根据组件名
    components: {
        "el-menu-item": elMenuItem,
        "el-submenu": elSubmenu
    },
    props: {
        data: {}
    }
}
</script>

<style>
</style>
