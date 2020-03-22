/* 1. Promise是一个类, 类中需要传入一个executor执行器， 默认会立即执行,就向下面这样会立即打印出1
```
new Promise(() => {
	console.log(1);
});
```
2. promise有内部会提供两个方法resolve和reject，注意不是原型对象上的，这两个方法会传给用户,可以更改promise的状态。
3. promise有三个状态：等待（PENDING）， 成功（RESOLVED）返回成功的原因， 失败（REJECTED）返回失败的原因，如果不写原因返回undefined，失败的情况只有两种 ：
		1. reject 
		2. 抛出异常
promise只会从等待变为成功或者从等待变为失败。

3. 每个promise实例上都要有一个then方法， 分别是成功和失败的回调。

ok，基于以上所述我们写一个最基本的promise

 */


const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

class Promise {
	constructor(executor) {
		this.status = PENDING; // 宏变量, 默认是等待态
		this.value = undefined; // then方法要访问到所以放到this上
		this.reason = undefined; // then方法要访问到所以放到this上
		this.onResolvedCallbacks = [];// 专门存放成功的回调函数
		this.onRejectedCallbacks = [];// 专门存放成功的回调函数
		let resolve = (value) => {
			if (this.status === PENDING) {// 保证只有状态是等待态的时候才能更改状态
				this.value = value;
				this.status = RESOLVED;
				// 需要让成功的方法依次执行
				this.onResolvedCallbacks.forEach(fn => fn());
			}
		};
		let reject = (reason) => {
			if (this.status === PENDING) {
				this.reason = reason;
				this.status = REJECTED;
				// 需要让失败的方法依次执行
				this.onRejectedCallbacks.forEach(fn => fn());
			}
		};
		// 执行executor传入我们定义的成功和失败函数:把内部的resolve和reject传入executor中用户写的resolve, reject
		try {
			executor(resolve, reject);
		} catch(e) {
			console.log('catch错误', e);
			reject(e); //如果内部出错 直接将error手动调用reject向下传递
		}
	}
	then(onfulfilled, onrejected) {
		if (this.status === RESOLVED) {
			onfulfilled(this.value);
		}
		if (this.status === REJECTED) {
			onrejected(this.reason);
		}
		// 处理异步的情况
		if (this.status === PENDING) {
			// this.onResolvedCallbacks.push(onfulfilled); 这种写法可以换成下面的写法，多包了一层，这叫面向切片编程，可以加上自己的逻辑
			this.onResolvedCallbacks.push(() => {
				// TODO ... 自己的逻辑
				onfulfilled(this.value);
			});
			this.onRejectedCallbacks.push(() => {
				// TODO ... 自己的逻辑
				onrejected(this.reason);
			});
		}
	}
}
module.exports = Promise;
