<template>
   <h1 v-if="type == 1"><slot></slot></h1>
   <h2 v-else-if="type == 2"><slot></slot></h2>
</template>

<script>
export default {
    props: ['type']
}
</script>

<style>

</style>
