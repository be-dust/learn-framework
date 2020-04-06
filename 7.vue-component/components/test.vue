<template>
  <div class="test">
	test {{$attrs}}
	<br>
	<!-- props中用到了a,b 那么只能用c,d -->
	<!-- <Test2 :c="$attrs.c" :d="$arrts.d"></Test2> -->
	<!-- 等价写法 将所有属性都传递给儿子组件-->
	<!-- 向test2传递属性：<Test2 v-bind="$attrs"></Test2> -->
	<!-- <Test2 v-bind="{a:1, b:2, c:3, d:4}"></Test2> -->

	向test2传递方法：<Test2 @click="click" @mousedown="mousedown"></Test2>

  </div>
</template>

<script>
import Test2 from './test2';
// 如果在props用了的属性表示本组件用到这些属性, 那么$attrs就会减少对应的属性
// $attrs是响应式的，父组件数据变了，子组件就跟着变
export default {
	inheritAttrs: false,// 没用到的属性也就是$arrts中剩下的元素，默认会加在.test上，如果不希望增加在dom元素上，就写上这句
	props: ['a', 'b'],
	components: {
		Test2
	},
	methods: {
		click() {
			console.log('click');
		},
		mousedown() {
			console.log('mousedown');
		}
	}
}
</script>

<style>

</style>