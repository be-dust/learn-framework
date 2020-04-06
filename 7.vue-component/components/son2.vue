<template>
  <div>
	son2 <Grandson @drink="drink"></Grandson>
  <!-- {{money}}<Grandson :money="money"></Grandson> -->
  </div>
</template>

<script>
import Grandson from './grandson';
export default {
  name: 'son2',
 /*  props: {
    money: Number
  }, */
  components: {
    Grandson
  },
  methods: {
    drink() {
      console.log('grandson中的喝水事件');
    }
  }
}
</script>

<style>

</style>