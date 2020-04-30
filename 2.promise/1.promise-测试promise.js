// promise a+ 规范  https://promisesaplus.com/
// 目前低版本浏览器 ie 不支持 需要polyfill



let Promise = require('./promise-complete');

let promise = new Promise((resolve, reject) => {
	resolve('hello');
});

// promise中执行了resolve('hello')，promise2中才能拿到hello,所以同理，promise2中调用resolve，promise3才能拿到promise2返回的结果
let promise2 = promise.then(() => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(new Promise((resolve, reject) => {
				resolve('hello');
			}));
		}, 0);
	});
});

let promise3 = promise2.then((data) => {
	console.log('success', data);
}, (err) => {
	console.log('fail', err);
});


let promise = new Promise((resolve, reject) => {
	resolve('hello');
});
let promise2 = promise.then(() => {
	return promise2;
});
promise2.then(() => {}, (err) => {
	console.log(err);
});

就会报下面的错
```
[TypeError: Chaining cycle detected for promise #<Promise>]
```
因为promise的then方法执行的时候创建了promise2，这个时候promise2状态是pending， 而成功回调里又返回promise2, 状态依然是pending，执行promise2.then方法只会添加订阅，一直得不到resolve, 于是自己等待自己就死循环了。

/* // 复杂情况
let promise = new Promise((resolve, reject) => {
	resolve('hello');
});
let promise2 = promise.then(() => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('hello');
		}, 0);
	});
});
promise2.then((data) => {
	console.log('成功', data);
}, (err) => {
	console.log('失败', err);
}) */