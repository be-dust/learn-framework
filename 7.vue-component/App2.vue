<template>
  <div>
    <!-- <Parent @eat="eat"></Parent>

	<button @click="$broadcast('drink', 'grandson', 'xxx')">触发grandson中的drink方法</button>

	<hr>

	<Test a='1' b='2' c='3' d="4"></Test>
    -->

    <Dialog>
      <!-- 老版本的写法是slot="" -->
      <!-- <div slot="header">header</div>
      <div slot="footer">footer</div> -->
      <!-- 新版本 只能用template-->
      <!-- <template v-slot:header>header</template>
      <template v-slot:footer>footer</template> -->

      <!-- 插槽的数据默认使用的是父组件的数据， 使用父组件的数据渲染好模板放入子组件中 -->
      <!-- <template v-slot:header>{{msg}}</template> -->


      <!-- 作用域插槽: 子组件向父组件传递数据， 使用子组件的数据渲染好模板放入子组件中-->
      <!-- <template v-slot:footer="{a, b, isShow}">{{a}} {{b}} {{isShow}}</template> -->

      <!-- 老板作用域插槽 -->
      <template slot="footer" slot-scope="{a, b, isShow}">{{a}} {{b}} {{isShow}}</template>
    </Dialog>
  </div>
</template> 

<script>
/* import Parent from './components/parent';
import Test from './components/test'; */

import Dialog from "./components/dialog";

// 这个对象就是Vue.extend中传入的对象
export default {
  data() {
    return {
      msg: 'hello'
    };
  },
  mounted() {
    this.$bus.$emit("监听事件", "hello");
  },
  components: {
    /* Parent,
		Test */
    Dialog
  },
  methods: {
    /* eat(value) {
			console.log('parent中的eat方法', value);// 在grandson中触发
		} */
  }
};
</script>

<style>
</style>