<template>
   <div>
       <a href="http://localhost:3000/bar">a标签点击</a>
       <button @click="show">点击我</button>
   </div>
</template>

<script>
export default {
    mounted() {
        console.log('foo');
    },
    methods: {
        show() {
            alert(1);
        }
    }
}
</script>

<style scoped>
</style>