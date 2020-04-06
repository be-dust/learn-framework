let fs = require('fs');
let Promise = require('./promise-complete');

// 将异步发方法 先转换成promise
function read(...args) {
	// 多了一层嵌套不好 
	// return new Promise((resolve, reject) => { 
	// 	fs.readFile(...args, function(err, data) {
	// 		if (err) reject(err);
	// 		resolve(data);
	// 	});
	// });

	let dfd = Promise.defer();// 延迟对象，可以解决promise的嵌套
	fs.readFile(...args, function(err, data) {
		if (err) dfd.reject(err);  
		dfd.resolve(data);
	});
	return dfd.promise;
}
read('./name.txt', 'utf8').then(data => {
	return read(data, 'utf8');
}).catch(err => {
	console.log('catch错误', err);
});

// 上面写法还是太麻烦

// 直接将异步的node方法转化成p romise方法
// let { promisify} = require('util'); node自带+
// let readFile = promisify(fs.readFile);

// 实现自己的promisify
function promisify(fn) {
	return function(...args) {
		return new Promise((resolve, reject) => {
			// fs.readFile('./name.txt', 'utf8')
			fn(...args, function(err, data) {
				if (err) reject(err);
				resolve(data);
			});
		});
	}
}

let readFile = promisify(fs.readFile);

readFile('./name.txt', 'utf8').then(data => {
	console.log(data);
	return readFile('./age.txt', 'utf8');
}).then(data => {
	console.log(data);
}).catch(err => {
	console.log('catch错误', err);
});
