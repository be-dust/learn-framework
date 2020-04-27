<template>
    <transition>
         <div v-show="visible">
            hello {{message}} {{type}}
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            message: '',
            type: '',
            visible: false,
            duration: 3000
        }
    },
    mounted() {
        if (this.duration > 0) {
            this.timer = setTimeout(() => {
                this.$destroy();// 销毁实例
                this.$el.parentNode.removeChild(this.$el);// 删除dom
            }, this.duration);
        }
    }
}
</script>

<style>
.v-enter {
    opacity: 0;
}
.v-enter-active {
    transition: opacity 0.1s linear;
}
.v-enter-to {
    opacity: 1;
}
</style>
