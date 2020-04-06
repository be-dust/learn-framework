<template>
    <input type="text" :value="value" @input="handleInput">
</template>

<script>
export default {
  name: 'el-input',
  props: {
    value: String
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);

      this.$dispatch('validate', 'el-form-item');

      // let parent = this.$parent;// 这里的父亲不一定就是el-form-item
      // while(parent) {
      //   let name = parent.$options.name;
      //   if (name === 'el-form-item') {
      //     break;
      //   } else {
      //     parent = parent.$parent;
      //   }
      // }
      // if (parent) {
      //   parent.$emit('validate');
      // }
    }
  }
};
</script>

<style>
</style>
