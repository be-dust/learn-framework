import Vue from 'vue';

import Vuex from 'vuex';

Vue.use(Vuex);

export default () => {
    let store = new Vuex.Store({
        state: {
            name: ''
        },
        mutations: {
            changeName(state) {
                state.name = 'zx';
            }
        },
        actions: {
            changeName({commit}) {// 模拟数据请求
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        commit('changeName');
                        resolve();
                    }, 5000);
                })
            }
        }
    });
    // 前端代码加载时要拿到最新的状态
    if(typeof window !== "undefined"){ 
        if(window.__INITIAL_STATE__){
            store.replaceState(window.__INITIAL_STATE__)
        }
    }
    return store;
}