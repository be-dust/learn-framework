
// let Promise = require('./promise');

let promise = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('xxx');
	}, 1000);
});
// 发布订阅模式应对异步 支持一个promise可以then多次
promise.then((res) => { 
	console.log('成功的结果1', res);
}, (error) => { 
	console.log(error);
});

promise.then((res) => { 
	console.log('成功的结果2', res);
}, (error) => { 
	console.log(error);
});