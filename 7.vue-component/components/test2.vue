<template>
  <div style="border: 1px solid #000;">
	test2 
	<br>
	接收的属性：{{$attrs}}
	<br>
	接收的方法: {{$listeners}}<button @click="$listeners.click">触发接收过来的函数</button>
  </div>
</template>

<script>
export default {
	mounted() {
		console.log(this.$listeners);
	}
}
</script>

<style>

</style>