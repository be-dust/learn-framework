let Promise = require('./promise-complete');

/* 
let p = new Promise((resolve, reject) => {
	resolve(new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(100);
		}, 1000);
	}));
});

p.then(data => {
	console.log(data);
// 我们写的Promise的结果是一个Promise {
//   status: 'PENDING',
//   value: undefined,
//   reason: undefined,
//   onResolvedCallbacks: [],
//   onRejectedCallbacks: []
// } 
}); */

/* // 想得到一个成功的promise 写法一
let p = new Promise((resolve, reject) => {
	resolve(100);
});
p.then(data => {
	console.log(data);
}) */

// 创建一个成功的promise
Promise.resolve = function(value) {
	return new Promise((resolve, reject) => {
		resolve(value);// 这里会递归解析
	})
}
// 创建一个失败的promise
Promise.reject = function(value) {
	return new Promise((resolve, reject) => {
		reject(value);
	})
}
// 写法二
// Promise.resolve(100).then(data => {
// 	console.log(data);
// });

// Promise.resolve 和 Promise.reject的区别， 前者可以接收一个promise，有等待效果，因为我们promise的resolve方法里使用了递归解析，后者接收promise不会有等待效果,如：

Promise.resolve(new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('aaaa');
	}, 1000);
})).then(data => {
	console.log(data);// 隔一秒输出aaaa
});

Promise.reject(new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('bbbb');
	}, 1000);
})).catch(data => {
	console.log(data);
// 输出结果
// Promise {
//   status: 'PENDING',
//   value: undefined,
//   reason: undefined,
//   onResolvedCallbacks: [],
//   onRejectedCallbacks: []
// }
});

// Promise.race 和 Promise.finally实现？