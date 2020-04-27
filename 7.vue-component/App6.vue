<template>
   <div>
      <button @click="show">点击出现弹层</button>
   </div>
</template>

<script>
import {Message} from './components/message';
export default {
    data() {
        return {
            
        }
    },
    methods: {
        show() {
            Message.success({message: '这是一个弹层'});
        }
    }
}
</script>

<style>

</style>

