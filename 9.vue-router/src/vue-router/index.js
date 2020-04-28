// 这里应该导出一个类，这个类上有一个install方法
// new	Router()
import install from './install';
import createMatcher from './create-matcher';
import HashHistory from './history/hash';

class VueRouter {
	constructor(options) {
		console.log('用户传入的配置', options); 
		// 默认需要先进性数据的格式化
		// matcher 匹配器 处理树形结构将它扁平化

		// 会返回两个方法 match：匹配结果  addRoute:动态添加路由
		this.matcher = createMatcher(options.routes);

		// 内部需要使用hash history， 进行路由的初始化工作
		// vue中有三种路由  
		// this就是router实例
		// 所有公共的方法都放在基类上，保证不同的路由api都有相同的使用方法
		this.history = new HashHistory(this);

		this.beforeEachs = [];
	}
	match(location) {// 路径一切换就调用匹配器进行匹配，将匹配的结果返回
		return this.matcher.match(location);
	}
	push(location) {
		this.history.transitionTo(location, () => {
			window.location.hash = location;// 跳转之后更新url, 注意：这个时候又会触发hashchange方法，需要做去重处理
		});
	}
	beforeEach(cb) {
		this.beforeEachs.push(cb);// 页面切换之前 会先执行这些方法
	}
	// 初始化方法
	init(app) {
		// app是最顶层的vue的实例

		// 1. 需要获取到路由的路径进行跳转匹配到对应的组件进行渲染
		// 2. 当第一次匹配完成后需要监听路由的变化

		const history = this.history;

		const setupHashListener = () => {// 跳转成功后的回调
			history.setupListener();// 监听路由变化的方法 父类中实现
		}

		history.transitionTo(// 跳转的方法 父类实现
			history.getCurrentLocation(),// 获取当前路径的方法  子类实现
			setupHashListener
			);
		history.listen((route) => {
			app._route = route;
		});
	}

}

VueRouter.install = install

export default VueRouter