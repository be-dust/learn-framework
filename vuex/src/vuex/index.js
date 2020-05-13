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
        // console.log(this);
        /* 格式化之后的样子：
        let root = {
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
        } */

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