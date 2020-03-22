import { observe } from './index';
import { arrayMethods, observerArray, dependArray } from './array';
import Dep from './dep';

export function defineReactive(data, key, value) {// 定义响应式的数据变化
	// vue不支持ie8 及 以下的浏览器 
	
	// 如果value依旧是一个对象的话 需要深度观察
	// observe(value); 

	let childOb = observe(value);// observe方法返回了一个Observer实例。我们传入的data可能是这样的 {arr: [1, 2, 3], a:{x: 1}}, 观测数据时我们会给data和data下的数组arr或者对象a都创建一个Observer实例，并且把这个实例挂载到一个__ob__上，这一步是在Observer类中实现的。

	let dep = new Dep();// 每一个属性都只会有一个dep，每一个属性都可能有多个依赖也就是watcher，比如他的渲染watcher，还有我们写的vm.$watch等等
	Object.defineProperty(data, key, { 
		// 依赖收集
		get() {
			// console.log('get响应数据');
			if (Dep.target) {// 页面第一次进行渲染的时候这里的Dep.target就是那个渲染watcher，渲染watcher是很多属性的公有watcher，因为第一次页面渲染时会取所有用到的数据，取值的时候都会走到他们的getter,从而把这个渲染watcher添加进自己的依赖中

			/* 	dep.addSub(Dep.target);
				
				这么写会有问题，因为页面中某一个属性可能会被多次取值，这样写的话每次取值都会把这个渲染watcher放进自己的依赖数组中去，造成了重复, 就会多次渲染，这个必须要解决,怎么解决呢？vue中用了一个很巧妙的方式，我们来看一看。
				
				vue中dep和watcher构成了互相依赖的关系，对于渲染watcher，他会记录下都是谁对他进行了收集，这样的话就可以去掉重复的dep。
				
				这里和我们正常的思路是相反的，我们一般会正着想：对于一个dep，他的watcher不能够重复，所以我们应该去掉重复的watcher，这样的话就会很容易理解。
				
				vue这么做其实很好理解，因为渲染watcher就一个，属性会有多个也就是dep会有多个，从渲染watcher出发当然更加合理 */
				dep.depend();

				if (childOb) {// 数组和对象都会走这，但是对对象来说是无意义的，因为上面已经收集过了，而且再次收集也不会有冲突
					childOb.dep.depend();// 这样数组也收集了当前的渲染watcher
					dependArray(value);// 多维数组递归依赖收集
				}
			}
			return value;
		},
		// 派发更新
		set(newValue) {
			if (newValue === value) return;
			// console.log('set响应数据');
			observe(newValue);
			value = newValue;

			dep.notify();// 通知本属性所有的依赖进行更新
		}
	});
}

class Observer {
	constructor(data) {// data就是我们之前定义的vm._data;
		// console.log('observer', data);// 用户传入的data如果有多层对象就会创建多个observer,当然也包括data本身
		
		this.dep = new Dep();// 这个dep专门给数组使用

		// 每个对象、包括数组都有一个__ob__属性，返回的是当前的Observer实例, 这个实例有一个dep属性
		Object.defineProperty(data, '__ob__', {
			get: () => this
		});
		if(Array.isArray(data)) {// 需要重写push等方法
			data.__proto__ = arrayMethods;// 只能拦截数组方法
			observerArray(data);// 数组的每一项也需要观测
		} else {
			this.walk(data);// 将数据使用defineProperty重新定义
		}
	}
	walk(data) {
		// for in 可能遍历原型链上的方法
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];// 用户传入的key
			let value = data[key];// 用户传入的值
			defineReactive(data, key, value);
		}
	}
}

export default Observer;