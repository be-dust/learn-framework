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


/* // 1)step1 引用同一个对象 造成死循环:自己等待自己的状态
let promise = new Promise((resolve, reject) => {
	resolve('hello');
});
let promise2 = promise.then(() => {
	return promise2;// 返回了一个promise2状态是pending， 自己等待自己就死循环了
});
promise2.then(() => {}, (err) => {
	console.log(err);
}) */

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