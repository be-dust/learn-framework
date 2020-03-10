// let Promise = require('./promise-complete');

let fs = require('fs');
let util = require('util');

let read = util.promisify(fs.readFile);


function isPromise(x) {
	// console.log(x);
	if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
		if (typeof x.then === 'function') {
			return true;
		}
	}
	return false;
}

Promise.all = function (promises) {
	let arr = [];
	return new Promise((resolve, reject) => {
		
		let idx = 0;// 只要涉及了异步就要使用定时器来计数

		// 处理结果
		const handleData = (value, index) => {
			arr[index] = value;
			/* if (arr.length === promises.length) {//这种写法是错误的, 因为异步的存在，当执行到 3 时， 3的索引是4，那么就执行了arr[4] = 3, 这个时候的arr.length已经等于4就直接resolve了， 所以最终返回的结果就是[ 1, <1 empty item>, 2, <1 empty item>, 3 ]
				resolve(arr);
			} */
			
			if (++idx === promises.length) {
				resolve(arr);
			}
		}
		for (let i = 0; i < promises.length; i++) { // 注意这里要用let， 因为promise.then是异步的，如果用var，那么最终handleData(y, i);拿到的i就是最后的i
			let currentValue = promises[i];// read方法会返回一个promise,因为读文件是异步的所以会先返回一个Promise { <pending> },接着往下执行同步代码
			if (isPromise(currentValue)) {
				currentValue.then((y) => {// 走到这里，由于promise.then是异步的，所以对于currentValue是普通值的情况就会先走也就是else里面的代码
					handleData(y, i);
				}, (err) => {
					reject(err);
				})
			} else {
				handleData(currentValue, i);
			}
		}
	})
}

// all 方法，最终返回的是一个Promise
// 全部成功才算成功，如果一个失败就算失败，一损俱损

Promise.all([1, read('./name.txt', 'utf8'), 2, read('./age.txt', 'utf8'), 3]).then((data) => {
	console.log(data);
}).catch(err => {
	console.log(err);
});