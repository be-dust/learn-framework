// location是一个对象
export function createRoute(record, location) {
	let res = []; // 如果匹配到了路径需要把所有匹配到了都放进去
	if (record) {
		while(record) {
			res.unshift(record);
			record = record.parent;
		}
	} // /about/a应该匹配到两条 /about 和 /about/a ， 这样是为了渲染时候一级一级的渲染
	return {
		...location,
		matched: res
	}
}
function runQueue(queue, iterator, callback) {
	// 一个个执行
	function step(index) {
		if (index === queue.length) return callback(); // 调用路由更新逻辑
		let hook = queue[index];// 钩子函数
		iterator(hook, ()=>step(index+1));
	}
	step(0);
}
class History {
	constructor(router) {
		this.router = router;
		// 当前路径和对应的匹配的结果
		this.current = createRoute(null, {// 默认是{matched: [], path: '/'}
			path: '/'
		});
		// console.log('初始化路由是', this.current);
		this.cb = undefined;
	}
	transitionTo(location, callback) {// 最好屏蔽一下，如果多次调用路径相同不需要跳转
		// 根据路径获取到对应的组件
		let r = this.router.match(location); // {path: '', matched: []}
		console.log(`路径${location}匹配到的记录`, r);


		// 判断是否是相同的路径 防止多次触发页面更新, 刚开始 this.current = {path: "/", matched: Array(0)};   r = {path: "/", matched: Array(1)}, 所以为了第一次能够往下执行需要多加一层matched的判断
		if (location == this.current.path && r.matched.length === this.current.matched.length) {
			return;
		}

		callback && callback();// 监听hash变化
		
		// 更改路径之后，需要先执行钩子
		let queue = this.router.beforeEachs;
		const iterator = (hook, next) => {
			// 调用用户传入的方法， 需要用户手动调用next方法
			hook(this.current, r, next);

		}
		runQueue(queue, iterator, () => {
			this.updateRoute(r);
		});
		
	}
	// 更新路由
	updateRoute(r) {
		this.current = r;// 将当前路径进行更新
		this.cb && this.cb(r);// 告诉_route属性更新，更新后视图会重新渲染
	}
	setupListener() {
        // 实际上应该根据当前模式监听不同的事件
		window.addEventListener('hashchange', () => {// hash变化后页面会重新跳转
			this.transitionTo(window.location.hash.slice(1));
		});
	}
	listen(cb) {
		this.cb = cb;
	}
}

export default History;