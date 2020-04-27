import Vue from 'vue'
import Vuex from '../vuex'
// import Vuex from 'vuex'

// import createLogger from 'vuex/dist/logger';

// 自己实现logger插件, 插件就是一个函数，源码中的createLogger是返回了一个函数,所以使用的时候是createLogger(),可以传参数进去
function logger(store) {
    // console.log(store);
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

// 数据持久化
// 每次刷新页面使用上一次的状态
// 官方插件 vue-persists

function debounce(fn, interval = 300) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    };
}

function persists(store) {
    let local = localStorage.getItem('VUEX:state');
    if (local) {
        store.replaceState(JSON.parse(local));// 会用local替换所有状态
    }
    store.subscribe((mutation, state) => {
        // 多次更改只记录一次, 需要做一个防抖
        debounce(() => {
            localStorage.setItem('VUEX:state', JSON.stringify(state));
        }, 1000)();
    });
}

Vue.use(Vuex)
let store = new Vuex.Store({
    plugins: [
        persists
        // logger
        // createLogger()// 每次提交的时候可以查看当前状态的变化， 第一次状态改变时，prev state只包含非动态注册的部分， next state包含左右的
    ],
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

store.registerModule('d', {
    state: {
        age: 'd100'
    }
});


store.registerModule(['b','c','e'], {
    state: {
        age: 'e100'
    }
});

export default store;