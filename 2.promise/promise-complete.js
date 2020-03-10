// 1. Promise是一个类 天生的, 类中需要传入一个executor执行器， 默认会立即执行
// new Promise(() => {
// 	console.log(1);
// });

// 2. promise 内部会提供两个方法，注意不是原型对象上的，这两个方法会传给用户,可以更改promise的状态
// 三个状态：等待， 成功， 失败
// resolve 成功 返回(成功的原因)； reject: 失败 返回(失败的原因)，如果不写原因返回undefined
// 失败的情况 ：1）reject 2)抛出异常
// 只会成功或者失败

//每个promise实例上都要有一个then方法， 分别是成功和失败的回调


const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

// 判断x的状态是让promise2变为成功态还是失败态
function resolvePromise(promise2, x, resolve, reject) {
	// console.log(promise2);
	// 此方法为了兼容所有的promise，n个库之间执行的流程是一样的
	// 尽可能详细， 不出错

	// 1)不能引用同一个对象 可能会造成死循环
	if (promise2 === x) {
		return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]----'));
	}
	let called;// promise的实现可能有多个，但都要遵循promise a+规范，我们自己写的这个promise用不上called,但是为了遵循规范才加上这个控制的，因为别人写的promise可能会有多次调用的情况。
	// 2)判断x的类型，如果x是对象或者函数，说明x有可能是一个promise，否则就不可能是promise
	if((typeof x === 'object' && x != null) || typeof x === 'function') {
		// 有可能是promise promise 要有then方法
		try {
			// 因为then方法有可能是getter来定义的, 取then时有风险，所以要放在try...catch...中
			// 别人写的promise可能是这样的
			// Object.defineProperty(promise, 'then', {
			// 	get() {
			// 		throw new Error();
			// 	}
			// })
			let then = x.then; 
			if (typeof then === 'function') { // 只能认为他是promise了
				// x.then(()=>{}, ()=>{}); 不要这么写，以防以下写法造成报错， 而且也可以防止多次取值
				// let obj = {
				// 	a: 1,
				// 	get then() {
				// 		if (this.a++ == 2) {
				// 			throw new Error();
				// 		}
				// 		console.log(1);
				// 	}
				// }
				// obj.then;
				// obj.then

				// 如果x是一个promise那么在new的时候executor就立即执行了，就会执行他的resolve，那么数据就会传递到他的then中
				then.call(x, y => {// 当前promise解析出来的结果可能还是一个promise, 直到解析到他是一个普通值
					// resolve(y);
					// 递归解析resolve的结果
					if (called) return;
					called = true;
					resolvePromise(promise2, y, resolve, reject);// resolve, reject都是promise2的
				}, r => {
					if (called) return;
					called = true;
					reject(r);
				});
			} else {
				// {a: 1, then: 1} 
				resolve(x);
			}
		} catch(e) {// 取then出错了 在错误中又调用了该promise的成功或则失败
			if (called) return;
			called = true;
			reject(e);
		}
	} else {
		resolve(x);
	}
}

class Promise {
	constructor(executor) {
		this.status = PENDING; // 宏变量, 默认是等待态
		this.value = undefined; // then方法要访问到所以放到this上
		this.reason = undefined; // then方法要访问到所以放到this上
		// 专门存放成功的回调函数
		this.onResolvedCallbacks = [];
		// 专门存放成功的回调函数
		this.onRejectedCallbacks = [];
		let resolve = (value) => {
			// 判断value的值
			if (value instanceof Promise) {
				value.then(resolve, reject);// 递归解析直到是普通值
				return;
			}
			if (this.status === PENDING) { // 保证只有状态是等待态的时候才能更改状态
				this.value = value;
				this.status = RESOLVED;

				// 需要让成功的方法一次执行
				this.onResolvedCallbacks.forEach(fn => fn());
			}
		};
		let reject = (reason) => {
			if (this.status === PENDING) {
				this.reason = reason;
				this.status = REJECTED;
				// 需要让失败的方法一次执行
				this.onRejectedCallbacks.forEach(fn => fn());
			}
		};
		// 执行executor 传入成功和失败:把内部的resolve和 reject传入executor中用户写的resolve, reject
		try {
			executor(resolve, reject); // 立即执行
		} catch (e) {
			console.log('catch错误', e);
			reject(e); //如果内部出错 直接将error 手动调用reject向下传递
		}
	}
	then(onfulfilled, onrejected) {
		// 为了实现链式调用，创建一个新的promise
		onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v;
		onrejected = typeof onrejected === 'function' ? onrejected : error => { throw error };
		let promise2 = new Promise((resolve, reject) => {
			if (this.status === RESOLVED) {
				// 执行then中的方法 可能返回的是一个普通值，也可能是一个promise，如果是promise的话，需要让这个promise执行
				// 使用宏任务把代码放在一下次执行 就可以取到promise2
				setTimeout(() => {
					try {
						let x = onfulfilled(this.value);
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) { // 一旦执行then方法报错就走到下一个then的失败方法中
						console.log(e);
						reject(e);
					}
				}, 0);
			}
			if (this.status === REJECTED) {
				setTimeout(() => {
					try {
						let x = onrejected(this.reason);
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e);
					}
				}, 0);
			}
			// 处理异步的情况
			if (this.status === PENDING) {
				// 这时候executor肯定是有异步逻辑
				// this.onResolvedCallbacks.push(onfulfilled); 这种写法可以换成下面的写法，多包了一层，这叫面向切片编程，可以加上自己的逻辑
				this.onResolvedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onfulfilled(this.value);
							resolvePromise(promise2, x, resolve, reject);
						} catch (e) {
							reject(e);
						}
					}, 0);
				});
				this.onRejectedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onrejected(this.reason);
							resolvePromise(promise2, x, resolve, reject);
						} catch (e) {
							reject(e);
						}
					}, 0);
				});
			}
		});

		return promise2;
	}
	catch(errCallback) {// catch就是没有成功的then方法
		return this.then(null, errCallback);
	}
}



Promise.defer = Promise.deferred = function() {
	let dfd = {};
	dfd.promise = new Promise((resolve, reject) => {
		dfd.resolve = resolve;
		dfd.reject = reject;
	});
	return dfd;
}

module.exports = Promise;