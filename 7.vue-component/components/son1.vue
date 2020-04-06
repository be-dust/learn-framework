<template>
  <div>
	son1
	<!-- {{money}} -->
	
	<!-- 方式一 -->
	<!-- <button @click="changeMoney(50)">更改父亲的钱数</button> -->

	<!-- 方式二  button上的click是原生的click方法-->
	<!-- <button @click="change">点击按钮</button> -->

	<!-- 方式三 -->
	<!-- {{value}}
	<button @click="change1">点击按钮</button> -->
	<!-- {{money}}
	<button @click="$emit('change', 500)">点击按钮</button> -->
	{{mny}}
	<button @click="$emit('update:mny', 500)">点击按钮</button>

  </div>
</template>

<script>
export default {
	// 子组件不能更改父组件中的数据,因为属性不是响应式的
	// 子组件调用父组件的函数，将需要修改的值传递给父组件，父组件数据修改后子组件重新渲染，这就是典型的单项数据流
	model: {
		prop: 'money',
		event: 'change'
	},
	props: {
		money: {
			type: Number
		},
		mny: {
			type: Number
		},
		/* value: {
			type: Number,
		}, */
		/* money: {
			type: Number,
			default: 100
		} */
		/* // 方式一：接收父组件传递过来的函数
		'changeMoney': {
			type: Function,
			default: () => {}
		} */
	},
	methods: {
		change1() {
			this.$emit('input', 50);
		},
		change() {
			this.$emit('click', 50);// 触发自己身上绑定的click事件
		}
	}
}
</script>

<style>

</style>