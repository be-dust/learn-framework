// function Parent() {
// this.name="parent";
// this.play=[1,2,3];
// }
// function Child() {
//     Parent.call(this);
//     this.name="child";
// }
// // 创建一个空的对象, Child.prototype == {},二者 指向同一块内存地址, 这个空对象的 __proto__指向的是Parent.prototype相当于Child.prototype.__proto__ 指向Parent.prototype
// // 该方法的原型对象就是参数
// Child.prototype = Object.create(Parent.prototype);
// Child.prototype.constructor = Child;

// var s = new Child();
// console.log(s instanceof Child);// true
// console.log(s.constructor);// Child



// function create(parentPrototype) {
// 	function Fn() {}
// 	Fn.prototype = parentPrototype;
// 	return new Fn();
// }

// es6支持静态方法，但不支持静态属性 
// 静态方法也可以被继承，原理就是 Child.__proto__ = Animal

// 那么静态属性有没有办法使用？有，使用get 属性访问器
class Animal {
	// a = 1; 是给实例上添加的 相当于constructor中写的
	static get a () {// 类上的a, 是给原型对象上添加的
			return 100;
	}
	// a: 100,
	constructor(name) {
		this.name = name;
	}
	eat() {
		console.log('吃肉');
	}
	get a() {// Animal.prototype.a = 100;
		return 100;
	}
}

class Tiger extends Animal {
	constructor(name) {
		super(name);// super就是父类
	}
	eat() {
		super.eat();// super就是Animal.prototype
		console.log('吃菜');
	}
}

let tiger = new Tiger('老虎');
console.log(Animal.a, tiger.a);// false
console.log(tiger.hasOwnProperty('a'));
tiger.eat();

// 实例属性 公共属性 静态方法 属性访问器