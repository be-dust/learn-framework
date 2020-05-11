<template>
   <div>
       bar name: {{$store.state.name}}
   </div>
</template>

<script>
export default {
    // 对服务端渲染不起作用，因为服务端渲染不支持mounted钩子,
    // 这里要注意，服务端返回给客户端的html字符串之后，客户端的代码就会执行，这个时候mounted钩子当然会执行。所谓的服务端渲染不支持mounted钩子,指的是服务端在执行server-entry.js中返回的函数时不支持mounted钩子，这个概念不要混淆了。
    // mounted() {
    //     this.$store.dispatch('changeName');
    // },
    // 规定这个方法可以在后端执行，只能在页面级组件使用
    asyncData(store) {
        return store.dispatch('changeName');
    }
}
</script>

<style scoped>
</style>
