import Vue from 'vue';
import App from './App.vue';
import createRouter from './router';
import createStore from './store';

export default function () {// 服务端和客户端都需要
    let router = createRouter();
    let store = createStore();
    let app = new Vue({
        // el: '#app', 服务端不需要
        store,
        router,// 前端直接注入
        render: h => h(App)
    });
    return {app, router, store}
}

// 服务端渲染需要一个vm实例, 但是，假如只有一个vm实例，那么所有客户端访问到的实例都是同一个,我们期望的是每一个客户端访问的都是一个全新的实例。

// 做法就是new Vue包装成一个函数,每次服务端渲染的时候都通过函数返回的实例来渲染