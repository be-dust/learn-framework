import RouterView from './components/router-view';
import RouterLink from './components/router-link';

const install = (Vue) => {
	console.log('install');
	// 默认希望可以把router放到任何的组件使用
	Vue.mixin({
		beforeCreate() {
			// 判断是不是根实例, 只有根实例上才会有router属性
			if (this.$options.router) {
				this._routerRoot = this;// 保存根实例, 就是new Vue得到的实例
				this._router = this.$options.router;

				this._router.init(this);// 重点 路由的初始化

				// 将current属性定义成响应式的， 这样更新current就可以刷新视图了
				// 

				Vue.util.defineReactive(this, '_route', this._router.history.current);
				// 每次更新路径之后需要更新_route属性

			} else {
				// 子组件上都有一个_routerRoot属性可以获取到最顶层的根实例
				this._routerRoot = this.$parent && this.$parent._routerRoot;
				// 如果组件想获取到根实例中传入的router
				// this._routerRoot._router
			}
		}
	})
	// 实现了一个代理功能
	Object.defineProperty(Vue.prototype, '$route', {
		get() {
			return this._routerRoot._route;
		}
	});
	Object.defineProperty(Vue.prototype, '$router', {
		get() {
			return this._routerRoot._router;
		}
	});
	// 全局组件
	Vue.component('RouterView', RouterView);
	Vue.component('RouterLink', RouterLink);

}

export default install