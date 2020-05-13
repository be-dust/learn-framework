import Vue from 'vue';
/* vue源码中使用es5构造函数的形式来构造Vue类， 这样写的好处是当我们给Vue定义方法时使用
```
Vue.prototype.xxx
```
这种方式，于是，不同的方法就可以放在不同的目录下，更加灵活利于扩展、维护。 */

let vm = new Vue({
	el: '#app',
	data() {
		return {
			msg: 'hello',
			name: 'zx',
			school: {name: 'zx', age: 25},
			arr: [1, 2, 3, {y: 2}, [45]],
			obj: {x: 1},
			firstName: 'zhang',
			lastName: 'xing'
		}
	},
	computed: {
		fullName() {
			return this.firstName + this.lastName;
		}
	},
	watch: {
		msg(newValue, oldValue) {
			// console.log('自定义watcher msg', newValue, oldValue);
		},
		name: {
			handler(newValue, oldValue) {
				// console.log('自定义watcher name', newValue, oldValue);
			},
			immediate: true
		}
	}
});
setTimeout(() => {
	// vm.arr = [222, 3433]
	// vm.obj = {y: 1};
	// vm.arr[4].push(55);
	// vm.arr.push({x: 1});// 那么数组怎么收集依赖呢?
	// vm.arr[3].y = 3;// 这种可以更新, 更改了数组中对象的属性,因为我们拦截了对象的属性的get和set

	vm.msg = 'world';
	vm.lastName = '三';
	vm.firstName = '李';
}, 1000);

/* 
setTimeout(() => {
	vm.msg = 'hello world';
	vm.msg = 'hahahah1';
	vm.msg = 'hahahah2';
	vm.msg = 'hahahah3';
	vm.msg = 'hahahah4';
}, 1000);

拿我们现在的代码来说，每次修改vm.msg, 就会重新渲染页面，性能不高， 我们希望最终拿到vm.msg = 'hahaha4'更新就好了。

vue就是使用批量更新来避免多次渲染。
 */

