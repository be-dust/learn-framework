import { observe } from './index'; 

// 要做的就是拦截用户调用的push shift unshift pop reverse sort splice， 这些方法都是会改变原数组

// 先获取老的数组方法，只改写这7个方法

let oldArrayProtoMethods = Array.prototype;

// 创建一个新的对象可以查找到老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = [
	'push',
	'pop',
	'unshift',
	'shift',
	'reverse',
	'sort',
	'splice'
];

export function observerArray(inserted) {
	for (let i = 0; i < inserted.length; i++) {
		observe(inserted[i]);
	}
}

export function dependArray(value) {
	for (let i = 0; i < value.length; i++) {
		let currentItem = value[i];// currentItem也有可能是一个数组
		currentItem.__ob__ && currentItem.__ob__.dep.depend();
		if (Array.isArray(currentItem)) {
			dependArray(currentItem);
		}
	}
}

methods.forEach(method => {
	arrayMethods[method] = function(...args) {// 函数劫持 切片编程
		oldArrayProtoMethods[method].apply(this, args);
		// 自己的逻辑
		// console.log('调用了数组更新的方法');
		// 如果数组新增的项是对象也需要进行响应化处理
		let inserted;// 新增的那一项
		switch(method) {
			case 'push':
			case 'unshift':
				inserted = args;
				break;
			case 'splice':
				inserted = args.slice(2);// 我们平时使用splice的形式： [].splice(0, 1, xxx), 这样args.slice(2)就可以取到xxx了
				break;
		}
		if (inserted) { observerArray(inserted) }
		this.__ob__.dep.notify();// 当调用数组的方法时通知视图更新, 那什么时候进行依赖收集呢?
	}
});