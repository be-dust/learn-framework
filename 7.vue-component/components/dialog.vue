<template>
  <div v-if="isShow">
    <slot name="header"></slot>
    这是一个弹框
    <slot name="footer" :isShow="isShow" a="a" b="b"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true
    };
  },
  mounted() {
    // {'监听事件': fn}
    this.$bus.$on("监听事件", function(params) {
      console.log("父组件mounted完成", params);
    });
  },
  methods: {
    change() {
      this.isShow = !this.isShow;
    }
  }
};
</script>

<style scoped lang="">
</style>
