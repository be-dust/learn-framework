// 类：方便扩展 封装 继承 多态
function Animal(name) {
	this.name = name;
	console.log(new.target);
	// new.target关键字
	if (new.target === Animal) {
		throw new Error('这是一个抽象类 can not  be new');
	}
}

Animal.prototype.eat = function() {
	console.log('吃肉');
}

function Tiger(name) {

}
new Animal()