// 高阶函数在异步中的应用
// 什么叫异步： 执行后的返回结果不能立马获取

// node中文件操作都是异步的

let fs = require('fs');// 读写文件

// 最早的异步解决方案: 回调函数 不能使用try catch来解决异常
// node中的回调函数的第一个参数永远是error

// 怎么基于回调函数来获取最终结果？


function after(times, callback) {
	let renderObj = {};
	return function(key, value) {
		renderObj[key] = value;
		if (--times == 0) {
			callback(renderObj);
		} 
	}
}

// 使用after中间函数产生一个新函数
let out = after(2, function(renderObj) {
	console.log(renderObj);
});
fs.readFile('./age.txt', 'utf8', function(error, data) {	
	out('age', data);
});
fs.readFile('./name.txt', 'utf8', function(error, data) {	
	out('name', data);
});

// 发布订阅 所有库中都存在发布订阅
// 观察者模式 就是基于发布订阅

