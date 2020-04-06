<template>
    <div>
        <el-menu>
            <!-- 因为渲染的模板有两种情况所以需要借助template标签, 因为是template，所以不能把这一层单独拿出去做一个递归组件，只能拆的更细一点 -->
            <template v-for="d in data">
                <el-resub :data="d" :key="d.id"></el-resub>
            </template>
        </el-menu>
    </div>
</template>

<script>
import elMenu from "./el-menu";
import elResub from './el-resub';
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    components: {
        'el-menu': elMenu,
        'el-resub': elResub
    },
}
</script>
