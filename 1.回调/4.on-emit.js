let fs = require('fs');

// 订阅好一件事 当这件事发生的时候 触发对应的函数
// 订阅：on； 发布： emit  ， promise内部也是基于发布订阅的

let e = {
	_obj: {},
	_callback: [],// 订阅 就是将函数放到数组中
	on(callback) {
		this._callback.push(callback);
	},
	emit(key, value) { // 发布就是让订阅的数组中的方法依次执行
		this._obj[key] = value;
		this._callback.forEach(method => {
			method(this._obj);
		})
	}
}

e.on(function(obj) { // 每次发布都要触发此函数
	console.log(obj);
});
e.on(function(obj) { // 每次发布都要触发此函数
	console.log(obj);
});

fs.readFile('./age.txt', 'utf8', function(error, data) {	
	e.emit('age', data);
});
fs.readFile('./name.txt', 'utf8', function(error, data) {	
	e.emit('name', data);
});