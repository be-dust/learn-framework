<template>
    <div id="app">
        {{$store.state.age}}<br>
        mapState的age: {{age}} <br>
        <!-- <button @click="$store.state.age = 100">点我</button> -->

        {{$store.getters.myAge}} <br>
        mapGetters的myAge:{{myAge}}
        <br>
        <button @click="syncChange">点我同步</button>
        <button @click="asyncChange">点我异步</button>
        <br>
        {{$store.state.a.age}}
        {{$store.state.b.age}}
        {{$store.state.b.c.age}}
        {{$store.state.b.c.e.age}}
        {{$store.state.d.age}}
    </div>
</template>

<script>
// import { mapState } from 'vuex';// 映射状态
import { mapState, mapGetters, mapMutations, mapActions } from './vuex';// 映射状态
// console.log(mapState(['age']));

export default {
    name: 'App',
    computed: {
        ...mapState(['age']),// 解构处理
        ...mapGetters(['myAge'])
        /* age() {
            return this.$store.state.age;// 和mapState效果一样
        } */
    },
    methods: {
        // ...mapMutations(['syncChange']),
        ...mapMutations({aaa: 'syncChange'}),
        ...mapActions({bbb: 'asyncChange'}),
        syncChange(){
            // this.$store.commit('b/c/syncChange', 10);
            // this.$store.commit('syncChange', 10);
            this.aaa(10);
        },
        asyncChange(){
            // this.$store.dispatch('asyncChange', 5);
            this.bbb(5);
        }
    }
}
</script>

<style>
</style>
