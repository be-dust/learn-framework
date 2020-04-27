import {debounce, throttle} from 'lodash';
// 存放懒加载功能
export default (Vue) => {
    class ReactiveListener {
        constructor({el, src, elRender, options}) {
            this.el = el;
            this.src = src;
            this.elRender = elRender;
            this.options = options;
            this.state = {loading: false};
        }
        checkInView() {// 判断是否渲染
            let {top} = this.el.getBoundingClientRect();
            return top < window.innerHeight * this.options.preLoad;
        }
        load() {// 加载当前的listener
            // 默认渲染loading图
            this.elRender(this, 'loading');
            loadImageAsync(this.src, () => {
                this.state.loading = true;
                this.elRender(this, 'loaded');
            }, () => {
                this.elRender(this, 'error');
            });// 异步加载方法
        }
    }

    function loadImageAsync(src, resolve, reject) {
        let image = new Image();
        image.src = src;
        image.onload = resolve;
        image.onerror = reject;
    }

    return class LazyClass {
        constructor(options) {
            this.options = options;
            this.listenerQueue = [];
            this.bindHandler = false;
            // 核心
            // 防抖: 在一段时间内不停地触发某事件，最终只触发一次
            // 节流：默认每隔一端时间执行一次
            // 这里适合用节流，如果用防抖的话就会出现用户滚动操作一直得不到响应
            this.lazyLoadHandler = throttle(() => {
                console.log('滚动');
                let catIn = false;
                this.listenerQueue.forEach(listener => {
                    if (listener.state.loading) return;// 如果渲染过了就不再判断和重新渲染了,对应的往回滚动的情况
                    catIn = listener.checkInView();// 判断是否应该渲染
                    catIn && listener.load();
                });
            }, 300);
        }
        add (el, bindings, vnode) {
            // 监控父级的滚动事件，当滚动时检测当前图片是否出现在了可视区域内
            // 这里获取不到真实的dom

            // 获取真实的dom
            Vue.nextTick(() => {
                function scrollParent() {
                    let parent = el.parentNode;
                    while (parent) {
                        if (/scroll/.test(getComputedStyle(parent)['overflow'])) {
                            return parent;
                        } 
                        parent = parent.parentNode;
                    }
                    return parent;
                }
                let parent = scrollParent();// 因为我们是给每一个img绑定了lazy指令，所以要注意scroll事件的重复绑定
                // console.log(parent);
                
                // 判断当前的图片是否要加载
                let src = bindings.value;
                // 每一个img都对应一个listener
                let listener = new ReactiveListener({
                    el,// 真实dom
                    src,
                    elRender: this.elRender.bind(this),
                    options: this.options,
                });
                this.listenerQueue.push(listener);
                if (!this.bindHandler) {
                    console.log('第一次绑定');
                    this.bindHandler = true;
                    parent.addEventListener('scroll', this.lazyLoadHandler);
                }

                // 初始化时需要判断一次
                this.lazyLoadHandler();
            });
        }
        elRender(listener, state) {// 根据当前实例的状态渲染
            let {el} = listener;
            let src = '';
            switch(state) {
                case 'loading':
                    el.src = listener.options.loading;
                    break;
                case 'error':
                    el.src = listener.options.error || '';
                    break;
                default:
                    src = listener.src;
                    break;
            }
            el.setAttribute('src', src);    
        }
    }
}


/* let arr = [1, 3, 43];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
    if (arr[i] === 3) continue;
    console.log(arr[i], 'end')
} */