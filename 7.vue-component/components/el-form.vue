<template>
  <form @submit.prevent>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'el-form',
  provide() {
    return {elForm: this}
  },
  props: {
    model: {
      type: Object,
      // default: {},// 会引用错乱
      default: ()=>{{}}// 使用函数返回一个对象，保证组件间的数据都是独立的
    },
    rules: Object
  },
  methods: {
    async validate(cb) {
      // 看一下 所有的form-item 是否符合规范
      // 调用一下 所有的form-item的validate方法看是否通过
      let children = this.$children;
      let arr = [];
      function findFormItem(children) {
        children.forEach(child => {
          if (child.$options.name === 'el-form-item') {
            arr.push(child);
          } 
          if (child.$children) {
            findFormItem(child.$children);
          }
        });
      }
      findFormItem(children);// 相当于$broadcast的作用
      // console.log(arr);
      try {
        await Promise.all(arr.map(child => child.validate()));
        cb(true);
      }catch(e) {
        cb(false);
      }
    }
  }
};
</script>

<style>
</style>
