<template>
  <div>
    <label v-if="label">{{label}}</label>
    <slot></slot>
    {{errMessage}}
  </div>
</template>

<script>
import Schema from 'async-validator';

export default {
  name: 'el-form-item',
  inject: ['elForm'],
  data() {
    return {
      errMessage: ''
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: String
  },
  mounted() {
    this.$on('validate', function() {
      this.validate();// 校验
    });
  },
  methods: {
    validate() {
      if (this.prop) {
        // 获取校验规则
        let rule = this.elForm.rules[this.prop];
        let newValue = this.elForm.model[this.prop];

        // element使用了验证库 async-validator
        let descriptor = {// 当前属性的描述
          [this.prop]: rule
        }
        let schema = new Schema(descriptor);// 通过描述信息创建一个骨架

        return schema.validate({[this.prop]: newValue}, (err, res) => {// 返回的是一个promise
          console.log('res', res);
          if (err) {
            // console.log('err', err);
            this.errMessage = err[0].message;
          } else {
            this.errMessage = '';
          }
        });
      }
    }
  }
};
</script>

<style>
</style>
