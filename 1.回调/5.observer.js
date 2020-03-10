// 发布订阅 特点：订阅方和发布方没有任何关系
// 观察者模式， 观察者和被观察者， 观察者和被观察者是有关联的，观察者需要将自己放到观察者之上，当被观察者发生变化，需要通知所有的观察者


class Subject { // 被观察者
	constructor(name) {
		this.name = name;
		this.state = '开心';
		this.observers =  [];
	}
	attach(o) {// 把注册者放到自己的身上
		this.observers.push(o);
	}
	setState(state) {
		this.state = state;
		this.observers.forEach(o => {
			o.update(this);
		});
	}
}
class Observer { // 观察者
	constructor(name) {
		this.name = name;
	}
	update(s) { // 被观察者状态发生变化了就调用这个方法
		console.log(this.name + ':' + s.name + '当前的状态是' + s.state);
	}
}

let baby = new Subject('xiaobaobao');
let dad = new Observer('爸爸');
let mother = new Observer('妈妈');
baby.attach(dad);
baby.attach(mother);

baby.setState('哭了');