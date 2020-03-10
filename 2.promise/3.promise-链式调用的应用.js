// promise 可以解决链式调用问题 jquery.then.then
// 原生效果 -> 写原理

let promise = new Promise((resolve, reject) => {
	resolve('hello');// 普通值意味着不是一个promise
});

promise.then(data => {
	return data; // then方法可以放回一个值(不是promise), 会把这个值放到下一次then的成功的回调中
}).then(data => {
	// console.log(data);
	return new Promise((resolve) => { //如果返回一个promise，那么回采用这个promise的结果
		setTimeout(() => {
			resolve('hello');
		}, 1000);
	});
}).then(data => {
	console.log(data);
	return new Promise((resolve, reject) => { 
		setTimeout(() => {
			reject('world');
		}, 1000);
	});
}).then(() => {

}, err => {
	console.log(err); // 如果在失败的函数中返回的是普通值也会走到下一次then的成功中
}).then(() => {
	console.log('成功');
	throw new Error('失败了');
}, () => {

}).then(() => {

}, () => {
	console.log('失败了');
}).catch(err => {// 捕获错误, 就近找
	console.log('catch');
}).then(() => {
	console.log('then');
});

// 什么时候走成功? then中返回一个普通值 或者一个成功的promise
// 什么时候失败？ 返回一个失败的promise，或者抛出异常

// catch的特点是如果都没有错误处理，从上往下找错误处理， 会找最近的catch，catch也是then会遵循then的规则
// .then.then并不是和jquery一样，jquery返回的是this， promise每次then返回的是新的promise