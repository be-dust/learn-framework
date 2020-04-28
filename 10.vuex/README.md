
## 1. 什么是vuex?
vuex是专门为vuejs应用设计的一套状态管理模式，提供了一套集中管理数据的概念和用法，用来解决中大型项目中组件间大量数据共享的问题。它的核心概念包括state、mutations、actions，基于这些它的工作流程是：
![image](https://vuex.vuejs.org/vuex.png)
## 2. vuex源码实现流程
vuex最终export了一个对象这个对象包括了一个install方法和一个类Store, 注意对应我们的使用方法
```js
let store = new Vuex.Store({})
```
install方法供Vue.use()使用，内部使用Vue.mixin在每一个组件的beforeCreate生命周期中给组件混入了一个$store属性，这个属性就是那个唯一的store。

从new Vuex.Store(options)开始，有以下主要流程：

1. 拿到用户传入的options,进行格式化，核心是register方法
2. 拿到格式化后的数据，从根模块开始递归的进行安装，核心是installModules方法

除了以上内容之外vuex还导出了一些辅助函数比如mapState、mapMutations、mapActions。

## 3. mutation为什么只能是同步？
严格模式下，mutation只能是同步。非严格模式下，如果你硬要使用异步也可以，当然不建议这么做。

如果我们使用异步的方法来更改状态，设想一下，我们希望使用log来记录状态更改来源，当两个组件同时修改同一个状态，对应有两个log, 那么这两个log到底分别对应的是哪个组件呢？

因为是异步的所以这两个修改动作的先后顺序无法保证，那么我们根本无法判断log和组件的对应关系，可能你以为是这个组件的log，实际上它是另一个组件的，这就让我们没办法去精确的进行调试和跟踪状态更改信息。
## 4. vuex中的state是怎么响应化的？
很简单就是直接使用 new Vue() 构造了一个Vue实例：
```js
 this.vm = new Vue({
    data: {
        state: options.state// 响应化处理
    }
});
```
这样state就是响应式的了，看到这其实你就应该明白为什么Vuex只能用在Vue项目中了。

当我们在访问state时还需要一层代理：
```js
get state() {// 获取实例上的state属性就会执行此方法
    return this.vm.state
}
```
当然这还没结束，以上只是针对最外层的state，那么如果我们写了modules，modules内部的模块的state是怎么处理的呢？

从这开始我们就接触到了Vuex最核心的东西了，上面我们说了new一个Store实例时会先将用户传入的数据进行格式化，这就是register方法主要做的事，下面我们就看看他到底是怎么格式化？格式化最终的结果是什么？

我们举一个例子：
```js
let store = new Vuex.Store({
    state: {// 单一数据源
        age: 10
    },
    getters: {
        myAge(state) {
            return state.age + 20;
        }
    },
    strict: true,
    // 严格模式下只能使用同步
    mutations: {
        syncChange(state, payload) {
            state.age += payload;
        }
    },
    actions: {
        asyncChange({commit}, payload) {
            setTimeout(() => {
                commit('syncChange', payload);
            }, 1000);
        }
    },
    modules: {
        a: {
            namespaced: true,
            state: {
                age: 'a100'
            }, 
            mutations: {
                syncChange() {
                    console.log('a-syncChange');
                }
            }
        },
        b: {
            namespaced: true,
            state: {
                age: 'b100'
            },
            mutations: {
                syncChange() {
                    console.log('b-syncChange');
                }
            },
            modules: {
                c: {
                    namespaced: true,
                    state: {
                        age: 'c100'
                    },
                    mutations: {
                        syncChange() {
                            console.log('c-syncChange');
                        }
                    },
                }
            }
        }
    }
});
```

先看看最终的结果
```
{
    _raw: rootModule,
    state: rootModule.state,
    _children: {
        a: {
            _raw: aModule,
            state: aModule.state,
            _children: {}
        },
        b: {
            _raw: aModule,
            state: aModule.state,
            _children: {
                c: {
                    _raw: cModule,
                    state: cModule.state,
                    _children: {}
                }
            }
        }
    }
} 
```
可以看到，这还是一个树形结构, _raw就是用户自己写的格式化之前的模块，state单独拿了出来是因为我们在安装模块时会用到，_children放的就是modules下面的内容, 当然子模块下还有可能有孙子模块...

划重点，register
```js
 register(path, rootModule) {    
    let rawModule = {
        _raw: rootModule,// 用户传入的模块定义
        _children: {},
        state: rootModule.state
    }

    rootModule.rawModule = rawModule;// 双向记录

    if (!this.root) {
        this.root = rawModule;
    } else {
        // 经典方法 找到当前模块的父亲
        let parentModule = path.slice(0, -1).reduce((root, current) => { // 注册c的时候 [b, c].slice(0, -1) 相当于 [b, c].slice(0, 1) 的结果就是[b]
            return root._children[current]
        }, this.root);
        parentModule._children[path[path.length-1]] = rawModule;
    }
    if (rootModule.modules) {
        forEach(rootModule.modules, (moduleName, module) => {
            // 注册a, [a] a模块的定义
            // 注册b, [b] b模块的定义

            // 注册c, [b, c] c模块的定义
            this.register(path.concat(moduleName), module);
        });
    }
}
```
register有两个参数，第一个是路径，数组类型，这里提一下，Vuex中判断模块层级关系就是使用数组，这也是一个经典通用的做法，下面会细说。第二个是根模块也就是进行格式化的起点，这里起点就是用户传入的数据。

往下我们看到有这一句
```js
 rootModule.rawModule = rawModule;// 双向记录
```
这个其实是为了动态注册时用的，之后会说。

再往下就是经典的找爸爸了：

对于根模块，先定义一个根root，作为起点，接下来的子模块会先走forEach，使用`path.concat(moduleName)`确定模块层级关系，然后进行递归注册，这里的forEach方法是我们自己封装的:
```js
let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key]);
    })
}
```

注意slice的用法，slice(0, -1)就是取出除了当前模块之外的模块，不清楚slice用法的赶紧去补补吧~

找到当前模块的父模块之后就把当前模块放在父模块的_children中，这样一次父子模块的注册就算完成了。

好了，我们回到正题，上面说了最外层的state已经实现了响应式，那么modules内部的state如何实现响应式处理?

这就又涉及到了Vuex的另一个核心方法installModules方法了:
```js
function installModule(store, rootState, path, rawModule) {// 安装时用的rawModule是格式化后的数据
    // 安装子模块的状态
    // 根据当前用户传入的配置 判断是否添加前缀
    let root = store.modules.root // 获取到最终整个的格式化结果
    let namespace = path.reduce((str, current)  => {
        root= root._children[current];// a
        str = str + (root._raw.namespaced ? current + '/' : '');
        return str;
    }, '');
    // console.log(path, namespace);
    if(path.length > 0) {// 表明是子模块
        // 如果是c，就先找到b
        // [b,c,e] => [b, c] => c 
        let parentState = path.slice(0, -1).reduce((rootState, current) => {
            return rootState[current];
        }, rootState);

        // vue的响应式不能对不存在的属性进行响应化
        Vue.set(parentState, path[path.length-1], rawModule.state);
    }
    // 安装getters
    let getters = rawModule._raw.getters;
    if (getters) {
        forEach(getters, (getterName, value) => {
            Object.defineProperty(store.getters, namespace + getterName, {
                get: () => {
                    // return value(rawModule.state);// rawModule就是当前的模块
                    return value(getState(store, path));
                }
            });
        });
    }
    // 安装mutation
    let mutations = rawModule._raw.mutations;
    if (mutations) {
        forEach(mutations, (mutationName, value) => {
            let arr = store.mutations[namespace + mutationName] || (store. mutations[namespace + mutationName] = []);
            arr.push((payload) => {
                // value(rawModule.state, payload);// 真正执行mutation的地方
                value(getState(store, path), payload);
                store.subs.forEach(fn => fn({type: namespace + mutationName, payload: payload}, store.state)); // 这就用到了切片
            });
        });
    }
    // 安装action
    let actions = rawModule._raw.actions;
    if (actions) {
        forEach(actions, (actionName, value) => {
            let arr = store.actions[namespace + actionName] || (store.actions[namespace + actionName] = []);
            arr.push((payload) => {
                value(store, payload);
            });
        });
    }
    // 处理子模块
    forEach(rawModule._children, (moduleName, rawModule) => {
        installModule(store, rootState, path.concat(moduleName), rawModule)
    });
}
```
installModules方法有四个参数:

1. store: new Vuex.Store()得到的实例
2. rootState: 最外层state
3. path: 模块层级关系
4. rawModule: 某个格式化后的模块

我们现在只关注这一段代码：
```
 if(path.length > 0) {// 表明是子模块
    // 如果是c，就先找到b
    // [b,c,e] => [b, c] => c 
    let parentState = path.slice(0, -1).reduce((rootState, current) => {
        return rootState[current];
    }, rootState);

    // vue的响应式不能对不存在的属性进行响应化
    Vue.set(parentState, path[path.length-1], rawModule.state);
}
```
看到了吧，还是找爸爸，之前是找父模块，这次是找父模块的状态。然后使用Vue.set()方法，对modules下的模块进行响应化处理。之后依旧是递归
```js
 // 处理子模块
forEach(rawModule._children, (moduleName, rawModule) => {
    installModule(store, rootState, path.concat(moduleName), rawModule)
});
```

## 5. getters实现原理
基于以上， 我们直接看installModules这一段代码：
```js
 // 安装getters
let getters = rawModule._raw.getters;
if (getters) {
    forEach(getters, (getterName, value) => {
        Object.defineProperty(store.getters, namespace + getterName, {
            get: () => {
                // return value(rawModule.state);// rawModule就是当前的模块
                return value(getState(store, path));
            }
        });
    });
}
```
这里面涉及了两个新东西：

1. namespace
2. getState

先说namespace,看下面这段代码
```js
 // 根据当前用户传入的配置 判断是否添加前缀
let root = store.modules.root // 获取到最终整个的格式化结果
let namespace = path.reduce((str, current)  => {
    root= root._children[current];// a
    str = str + (root._raw.namespaced ? current + '/' : '');
    return str;
}, '');
```
还是reduce，加上了命名空间之后原来的方法xxx就变成了a/b/xxx。

getState方法:
```js
// 递归的获取每一个模块的最新状态
function getState(store, path) {   
    let local = path.reduce((newState, current) => {
        return newState[current];
    }, store.state);
    return local;
}
```
还是reduce，getState主要是结合Vuex实现数据持久化使用，下面我们会介绍，这里先跳过。

ok， 大致了解了这两个东西之后，我们再看getters, 可以看出最终所有的getter都使用Object.defineProperty定义在了store.getters这个对象中，`注意这里相当于把本来的树形结构给铺平了`, 这也就是当我们不适用namespace时，一定要保证不能重名的原因。
## 6. mutations实现原理
```js
// 安装mutation
let mutations = rawModule._raw.mutations;
if (mutations) {
    forEach(mutations, (mutationName, value) => {
        let arr = store.mutations[namespace + mutationName] || (store. mutations[namespace + mutationName] = []);
        arr.push((payload) => {
            value(getState(store, path), payload);
        });
    });
}
```
知道了getters的原理mutations的原理就也知道了，这里就是订阅，对应的commit就是发布。
## 7. actions实现原理
```js
 // 安装action
let actions = rawModule._raw.actions;
if (actions) {
    forEach(actions, (actionName, value) => {
        let arr = store.actions[namespace + actionName] || (store.actions[namespace + actionName] = []);
        arr.push((payload) => {
            value(store, payload);
        });
    });
}
```
同理，依旧是订阅和发布。
## 8. 动态注册module如何实现？
动态注册是Vuex提供的一个类方法registerModule
```js
// 动态注册
registerModule(moduleName, module) {
    if (!Array.isArray(moduleName)) {
        moduleName = [moduleName];
    }
    this.modules.register(moduleName, module); // 这里只做了格式化
    installModule(this, this.state, moduleName, module.rawModule);// 从当前模块开始安装
}
```
它有两个参数，第一个是要注册的模块名称，这个参数对应的register方法中的path，应该是一个数组类型。第二个是对应的选项。内部还是先格式化然后安装的流程，安装时就用到了上面提到的双向绑定
```
rootModule.rawModule = rawModule;
```
对应的
```
rawModule._raw = rootModule;
```
rootModule是格式化之前的模块，rawModule是格式化之后的模块。rootModule
:::warning
注意在安装的时候是从当前的模块开始的，并不是从根模块开始。
:::

使用方式:

注册一个单一模块
```js
store.registerModule('d', {
    state: {
        age: 'd100'
    }
});
```

注册一个有层级的模块
```js
store.registerModule(['b','c','e'], {
    state: {
        age: 'e100'
    }
});
```
## 9. 命名空间
多模块下，如果不使用命名空间为什么不能够重名？

这个上面说getters实现原理时就提到过，因为安装时，无论是getters还是mutations、actions, 要么是在一个对象中铺平，要么是在一个数组中铺平，如果重名且不使用命名空间势必会冲突。
## 10. vuex插件
用户选项中除了state、getters、mutations、actions等之外还有一个plugins选项，为每一个mutation暴露一个钩子，结合Vuex提供的subscribe方法就能够监听到每一次的mutation信息。

插件其实就是函数，当new Vuex.Store() 时就会去执行一次
```
this.subs = [];
let plugins = options.plugins;
plugins.forEach(plugin => plugin(this));
```
内部其实还是发布和订阅的应用，这里我们实现两个常用插件

1. logger
2. 状态持久化

在此之前我们先看下Vuex提供的subscribe方法, 这是一个类方法
```js
subscribe(fn) {
    this.subs.push(fn);
}
```
可以看到就是订阅,既然是用来监听mutation变化，那发布的位置必然是和mutation相关的，接下来我们更改下mutation的安装
```js
// 安装mutation
let mutations = rawModule._raw.mutations;
if (mutations) {
    forEach(mutations, (mutationName, value) => {
        let arr = store.mutations[namespace + mutationName] || (store. mutations[namespace + mutationName] = []);
        arr.push((payload) => {
            value(getState(store, path), payload);
            store.subs.forEach(fn => fn({type: namespace + mutationName, payload: payload}, store.state)); // 这就用到了切片
        });
    });
}
```
当执行了mutation之后，再去执行subs里面的每一个方法，这里就是发布了。在这里我们也看到了另外一个编程的亮点：`切片`,
```
arr.push((payload) => {
    value(getState(store, path), payload);
    store.subs.forEach(fn => fn({type: namespace + mutationName, payload: payload}, store.state)); // 这就用到了切片
});
```
这里如果我们不考虑subscribe，完全就可以写成
```js
arr.push(value);
```
因为value就是一个mutation，是一个方法，直接存起来就好了，但是这样一来就没法做其他事情了，而使用切片就很方便我们扩展，这就是切片编程的魅力所在。

下面我们就看看logger插件的实现
```js
function logger(store) {
    let prevState = JSON.stringify(store.state);// 默认状态, 需要用JSON.stringify做一层深拷贝，否则preState是引用类型，那么当store.state变化，preState立马就跟着变化，这样就无法打印出上一次的状态
    // let prevState = store.state;// 默认状态
    // 订阅
    store.subscribe((mutation, newState) => {// 每次调用mutation 此方法就会执行
        console.log(prevState);
        console.log(mutation);
        console.log(JSON.stringify(newState));
        prevState = JSON.stringify(newState);// 保存最新状态
    });
}
```
数据持久化
```js
function persists(store) {
    let local = localStorage.getItem('VUEX:state');
    if (local) {
        store.replaceState(JSON.parse(local));// 会用local替换所有状态
    }
    store.subscribe((mutation, state) => {
        // 多次更改只记录一次, 需要做一个防抖
        debounce(() => {
            localStorage.setItem('VUEX:state', JSON.stringify(state));
        }, 500)();
    });
}
```
原理就是使用了浏览器自带的一个api localStorage，这里有一个新方法replaceState, 这也是一个类方法
```js
replaceState(newState) {
    this.vm.state = newState;
}
```
该方法用来更新状态, 这里需要注意，我们更改的仅仅是状态state, 而getters、 mutations、 actions执行时仍旧使用的是旧的状态，这个是在安装时决定的，因此我们还需要让他们在每次执行的时候能够拿到最新的状态，所以还记得上面说的getState方法吗？

> 这里做了一个小的优化就是用节流做了一个优化, 以应对连续不断的更改状态，至于节流就不再这赘述了。

最后我们说下插件的使用:
```
plugins: [
    persists,
    logger 
],
```
:::warning
注意logger方法， 第一次状态改变时，prev state只包含非动态注册的模块， next state包含所有模块,这是因为第一次执行logger方法的时候传入的store还没有包含动态注册的模块。
:::

## 11. 辅助函数实现原理
Vuex提供了mapState、mapGetters、mapMutations、mapActions这几个辅助方法,方便我们书写。我们把这几个分成两类:

1. mapState、mapGetters 这两个我们使用时是放在computed中的
```js
computed: {
    ...mapState(['age']),// 解构处理
    ...mapGetters(['myAge'])
    /* age() {
        return this.$store.state.age;// 和mapState效果一样
    } */
},
```
2. mapMutations、mapActions这两个使用时是放在methods中的
```js
 methods: {
    // ...mapMutations(['syncChange']),
    ...mapMutations({aaa: 'syncChange'}),// 使用别名
    ...mapActions({bbb: 'asyncChange'})
}
```
mapState
```
export function mapState (stateArr) {// {age: fn}
    let obj = {};
    stateArr.forEach(stateName => {
        obj[stateName] = function() {
            return this.$store.state[stateName];
        }
    });
    return obj;
}
```

mapGetters
```js
export function mapGetters(gettersArr) {
    let obj = {};
    gettersArr.forEach(getterName => {
        obj[getterName] = function() {
            return this.$store.getters[getterName];
        }
    });
    return obj;
}
```
mapMutations
```
export function mapMutations(obj) {
    let res = {};
    Object.entries(obj).forEach(([key, value]) => {
        res[key] = function(...args) {
            this.$store.commit(value, ...args);
        }
    });
    return res;
}
```
mapActions
```
export function mapActions(obj) {
    let res = {};
    Object.entries(obj).forEach(([key, value]) => {
        res[key] = function(...args) {
            this.$store.dispatch(value, ...args);
        }
    });
    return res;
}
```

我们这里分别实现了传入数组和对象类型的参数，源码中使用normalizeMap方法兼容了二者。最终返回了一个对象，因此我们使用时需要进行解构。

最后附上完整代码
```
let Vue;

let forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key]);
    })
}

class ModuleCollection {
    constructor(options) {
        // 深度遍历，将所有的子模块都遍历一遍
        this.register([], options);
    }
    register(path, rootModule) {    
        let rawModule = {
            _raw: rootModule,// 用户传入的模块定义
            _children: {},
            state: rootModule.state
        }

        rootModule.rawModule = rawModule;// 双向记录

        if (!this.root) {
            this.root = rawModule;
        } else {
            // 经典方法 找到当前模块的父亲
            let parentModule = path.slice(0, -1).reduce((root, current) => { // 注册c的时候 [b, c].slice(0, -1) 相当于 [b, c].slice(0, 1) 的结果就是[b]
                return root._children[current]
            }, this.root);
            parentModule._children[path[path.length-1]] = rawModule;
        }
        if (rootModule.modules) {
            forEach(rootModule.modules, (moduleName, module) => {
                // 注册a, [a] a模块的定义
                // 注册b, [b] b模块的定义

                // 注册c, [b, c] c模块的定义
                this.register(path.concat(moduleName), module);
            });
        }
    }
}

// 递归的获取每一个模块的最新状态
function getState(store, path) {   
    let local = path.reduce((newState, current) => {
        return newState[current];
    }, store.state);
    return local;
}
function installModule(store, rootState, path, rawModule) {// 安装时用的rawModule是格式化后的数据
    // 安装子模块的状态
    // 根据当前用户传入的配置 判断是否添加前缀
    let root = store.modules.root // 获取到最终整个的格式化结果
    let namespace = path.reduce((str, current)  => {
        root= root._children[current];// a
        str = str + (root._raw.namespaced ? current + '/' : '');
        return str;
    }, '');
    // console.log(path, namespace);
    if(path.length > 0) {// 表明是子模块
        // 如果是c，就先找到b
        // [b,c,e] => [b, c] => c 
        let parentState = path.slice(0, -1).reduce((rootState, current) => {
            return rootState[current];
        }, rootState);

        // vue的响应式不能对不存在的属性进行响应化
        Vue.set(parentState, path[path.length-1], rawModule.state);
    }
    // 安装getters
    let getters = rawModule._raw.getters;
    if (getters) {
        forEach(getters, (getterName, value) => {
            Object.defineProperty(store.getters, namespace + getterName, {
                get: () => {
                    // return value(rawModule.state);// rawModule就是当前的模块
                    return value(getState(store, path));
                }
            });
        });
    }
    // 安装mutation
    let mutations = rawModule._raw.mutations;
    if (mutations) {
        forEach(mutations, (mutationName, value) => {
            let arr = store.mutations[namespace + mutationName] || (store. mutations[namespace + mutationName] = []);
            arr.push((payload) => {
                // value(rawModule.state, payload);// 真正执行mutation的地方
                value(getState(store, path), payload);
                store.subs.forEach(fn => fn({type: namespace + mutationName, payload: payload}, store.state)); // 这就用到了切片
            });
        });
    }
    // 安装action
    let actions = rawModule._raw.actions;
    if (actions) {
        forEach(actions, (actionName, value) => {
            let arr = store.actions[namespace + actionName] || (store.actions[namespace + actionName] = []);
            arr.push((payload) => {
                value(store, payload);
            });
        });
    }
    // 处理子模块
    forEach(rawModule._children, (moduleName, rawModule) => {
        installModule(store, rootState, path.concat(moduleName), rawModule)
    });
}

class Store {
    constructor(options) {
        // console.log(options);
        // 获取用户传入的所有属性
        // this.state = options.state;
        this.vm = new Vue({
            data: {
                state: options.state// 响应化处理
            }
        });
       

        this.getters = {};// store内部使用的getters
        this.mutations = {};
        this.actions = {};

        // 1. 需要将用户传入的对象格式化操作
        this.modules = new ModuleCollection(options);
        // 2. 递归安装模块 ，从根模块开始
        installModule(this, this.state, [], this.modules.root);
        this.subs = [];
        let plugins = options.plugins;
        plugins.forEach(plugin => plugin(this));
    }
    subscribe(fn) {
        this.subs.push(fn);// 可以多次订阅
    }
    replaceState(newState) {
        this.vm.state = newState;// 更新状态, 这里需要注意，我们更改的仅仅是状态state, 而getters mutations actions仍旧使用的时旧的状态，这个是在安装时决定的，因此我们还需要让他们在每次执行的时候能够拿到最新的状态
    }
    get state() {// 获取实例上的state属性就会执行此方法
        return this.vm.state
    }
    commit = (mutationName, payload) => {// es7写法， 这个里面的this永远指向的就是当前store实例
        // this.mutations[mutationName](payload);
        this.mutations[mutationName].forEach(mutation => mutation(payload));
    }
    dispatch = (actionName, payload) => {
        // this.actions[actionName](payload);
        this.actions[actionName].forEach(action => action(payload));
    }
    // 动态注册
    registerModule(moduleName, module) {
        if (!Array.isArray(moduleName)) {
            moduleName = [moduleName];
        }
        this.modules.register(moduleName, module); // 这里只做了格式化
        installModule(this, this.state, moduleName, module.rawModule);// 从当前模块开始安装
    }
}
const install = (_Vue) => {
    Vue = _Vue;

    // 放到原型上不对，因为默认会把所有Vue实例都添加$store属性
    // 我们想要的是只从当前的根实例开始，到他所有的子组件都有$store属性

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

export function mapState (stateArr) {// {age: fn}
    let obj = {};
    stateArr.forEach(stateName => {
        obj[stateName] = function() {
            return this.$store.state[stateName];
        }
    });
    return obj;
}

export function mapGetters(gettersArr) {
    let obj = {};
    gettersArr.forEach(getterName => {
        obj[getterName] = function() {
            return this.$store.getters[getterName];
        }
    });
    return obj;
}

export function mapMutations(obj) {
    let res = {};
    Object.entries(obj).forEach(([key, value]) => {
        res[key] = function(...args) {
            this.$store.commit(value, ...args);
        }
    });
    return res;
}
export function mapActions(obj) {
    let res = {};
    Object.entries(obj).forEach(([key, value]) => {
        res[key] = function(...args) {
            this.$store.dispatch(value, ...args);
        }
    });
    return res;
}
export default {
    install,
    Store
}
```