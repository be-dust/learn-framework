

## 1. 什么是vuex?

## 2. mutation为什么只能是同步？
严格模式下，mutation只能是同步。非严格模式下，如果你硬要使用异步也可以，当然不建议这么做
## 3. vuex中的state是怎么响应化的？
核心就是创建了一个Vue的实例
```js
constructor(options) {
        this.vm = new Vue({
            data: {
                state: options.state// 响应化处理
            }
        })
    }
    get state() {// 获取实例上的state属性就会执行此方法
        return this.vm.state
    }
}
```

## 4. getters实现原理

## 5. mutations实现原理

## 6. actions实现原理

## 动态注册module如何实现？

## 命名空间
多模块下，如果不使用命名空间为什么不能够重名？

## vuex插件

状态持久化

## vuex整体实现的核心
reduce递归 

## 辅助函数mapState原理