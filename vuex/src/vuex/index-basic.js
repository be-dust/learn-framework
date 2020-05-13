let Vue;

let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key]);
    })
}

class Store {
    constructor(options) {
        console.log(options);
        // 获取用户传入的所有属性
        // this.state = options.state;
        this.vm = new Vue({
            data: {
                state: options.state// 响应化处理
            }
        });
        let getters = options.getters;// 用户传入的是函数

        this.getters = {};// store内部使用的getters
        // 不要使用for...in, 因为for...in会遍历原型
        // 遍历对象的功能常用
       /*  Object.keys(getters).forEach(getterName => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return getters[getterName](this.state)
                }
            })
        }); */
        forEach(getters, (getterName, value) => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return value(this.state);
                }
            })
        });

        // 处理用户的传入的mutations
        let mutations = options.mutations;
        this.mutations = {};
        forEach(mutations, (mutationName, value) => {
            // this.mutations[mutationName] = value;
            this.mutations[mutationName] = (payload) => {
                value(this.state, payload);
            }
        });

        // 处理用户传入的actions
        let actions = options.actions;
        this.actions = {};
        forEach(actions, (actionName, value) => {// 需要监控一下是不是所有的异步都是在action中执行
            this.actions[actionName] = (payload) => {
                value(this, payload);// 和mutations不同，第一个参数是store实例
            }
        });
    }
    get state() {// 获取实例上的state属性就会执行此方法
        return this.vm.state
    }
    commit = (mutationName, payload) => {// es7写法， 这个里面的this永远指向的就是当前store实例
        this.mutations[mutationName](payload);
    }
    dispatch = (actionName, payload) => {
        this.actions[actionName](payload);
    }
}
const install = (_Vue) => {
    Vue = _Vue;

    // 放到原型上不对，因为默认会把所有Vue实例都添加$store方法
    // 我们想要的是只从当前的根实例开始，到他所有的子组件都有$store方法

    Vue.mixin({
        beforeCreate() {
            // console.log('这是mixin中的1', this.$options.name);
            
            // 把根实例的store属性放到每一个组件中
            if (this.$options.store) {
                this.$store = this.$options.store;
            } else {
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    });// 抽离公共的逻辑

}
export default {
    install,
    Store
}