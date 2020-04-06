import Lazy from './lazy';
// export let _Vue;
export default {
    // install方法中有两个参数，第一个是Vue的构造函数, 第二个是选项
    install (Vue, options) {
        // _Vue = Vue;// 为了保证和当前用户使用的Vue构造函数保持一致
        // console.log(Vue, options);   

        const lazyClass = Lazy(Vue);
        const lazy = new lazyClass(options);

        // vue-lazyload 主要提供了一个指令
        // 1) 可能注册一些全局组件 2) 给Vue的原型扩展属性 3)全局指令和过滤器
        Vue.directive('lazy', {
            bind: lazy.add.bind(lazy),// 保证当前add方法执行时的this永远指向lazy实例
        });
    }
}

