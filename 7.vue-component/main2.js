import Vue from 'vue';

// import VueLazyLoad from 'vue-lazyload';
import VueLazyLoad from './vue-lazyload';

import App from './App';

Vue.use(VueLazyLoad, {
    preLoad: 0.5,// 可见区域的0.5呗，可见区域指的的窗口的大小的0.5倍
    loading: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586177625400&di=3aa28e48704c8d8139d1535a62ac6176&imgtype=0&src=http%3A%2F%2Fwww.17qq.com%2Fimg_qqtouxiang%2F61031937.jpeg'
});

new Vue({
    el: '#app',
    render: h => h(App)
})