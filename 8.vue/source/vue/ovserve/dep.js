// 发布订阅者模式
// dep就是提供一个订阅、一个发布，还有存放当前的watcher这么几个功能。
let id = 0;
class Dep {
	constructor() {
		this.id = id++;
		this.subs = [];
	}
	addSub(watcher) { // 订阅
		this.subs.push(watcher);
	}
	notify() {// 发布
		this.subs.forEach(watcher => {
			watcher.update();
		});
	}
	depend() {
		if (Dep.target) {// 为了防止直接调用depend方法
			Dep.target.addDep(this);// Dep.target就是那个渲染watcher, 让watcher记住dep
		}
	}
}
// 用来保存当前watcher
let stack = [];
export function pushTarget(watcher) {
	Dep.target = watcher;
	stack.push(watcher);
}
export function popTarget(watcher) {
	stack.pop();
	Dep.target = stack[stack.length - 1];
}
export default Dep;// 收集一个个依赖
/* let dep = new Dep();
dep.addSub({
	update() {
		console.log(1);
	}
});
dep.addSub({
	update() {
		console.log(2);
	}
});
dep.notify(); */