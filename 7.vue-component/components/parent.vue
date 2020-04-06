<template>
  <div>
	parent

	<!-- 方式一 父向子传递一个方法，等会子调用这个方法， 这个方法是父的-->
	<!-- <Son1 :money="money" :change-money="changeMoney"></Son1> -->
	
	<!-- 方式二 给儿子绑定一个事件， 等会儿子自己再触发这个事件，当然这个事件也是父的 -->
	<!-- v-on:click="changeMoney" 相当于son1上绑定了一个事件: son1.$on('click', changeMoney) -->
	<!-- click不是原生的事件 -->
	<!-- 当然，这里的click可以修改为任何其他变量, 这个是常用的父与子通信方式-->
	<!-- <Son1 :money="money" @click="changeMoney"></Son1> -->
	
	<!-- 改为原生方法 -->
	<!-- <Son1 :money="money" @click.native="changeMoney"></Son1> -->


	<!-- 方式三： 父与子同步数据 v-model 和 .sync-->
	<!-- <Son1 :value="money" @input="val => money=val"></Son1> -->
    <!-- 可以更换成 v-model 默认是value+input的语法糖 -->
	<!-- <Son1 v-model="money"></Son1> -->

	<!-- 自定义v-model -->
	<!-- <Son1 v-model="money"></Son1> -->

	<!-- .sync语法 也是语法糖 -->
	<!-- <Son1 :mny="money" @update:mny="val=>money=val"></Son1> -->
	<!-- <Son1 :mny.sync="money"></Son1> -->
	<Son1></Son1>
	<hr>
	<Son2 :money="money" @eat="eat"></Son2>
  </div>
</template>

<script>
/* 组件通信
1. 父子
2. 子父
3. 兄弟
4. 爷孙 */
import Son1 from './son1';
import Son2 from './son2';
export default {
	name: 'parent',
	provide() {// 提供者 上下文
		return {parent: this}// 将这个组件暴露出去
	},
	data() {
		return {
			money: 100
		}
	},
	components: {
		Son1,
		Son2
	},
	methods: {
		changeMoney(value) {// methods 中的函数已经bind过了，所以子组件中调用changeMoney的时候this还是指向parent的
			this.money += value;
		},
		eat() {
			console.log('son2 上的eat');
		}
	}
}
</script>

<style>

</style>