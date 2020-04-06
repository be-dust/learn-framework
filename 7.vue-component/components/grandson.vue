<template>
  <div>
	grandson {{parent.money}}

  <button @click="$dispatch('eat', 'son2', '米饭')">触发eat</button>
  </div>
</template>

<script>
export default {
   name: 'grandson',
   inject: ['parent'],
}
</script>

<style>

</style>