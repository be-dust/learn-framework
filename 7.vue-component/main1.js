import Vue from 'vue';
import App from './App.vue'; // App就是那个对象
// console.log(App); // 打印出来已经有render函数了

Vue.prototype.$dispatch = function (eventName, componentName, value) {
	let parent = this.$parent;
	while (parent) {
		if (parent.$options.name === componentName) {
			parent.$emit(eventName, value); // 没有绑定触发也不会有影响
			break;
		}
		parent = parent.$parent;
	}
}

// 一个父亲可能有多个儿子
Vue.prototype.$broadcast = function (eventName, componentName, value) {
	let children = this.$children; // 数组
	// console.log(children);
	function broadcast(children) {
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			if (componentName === child.$options.name) {
				child.$emit(eventName, value);
				return;
			} else {
				if (child.$children) {
					broadcast(child.$children);
				}
			}
		}
	}
	broadcast(children);
}

Vue.prototype.$bus = new Vue();// 每个vue实例上都具备$on, $emit, $off


// 默认使用runtime-only
new Vue({
	el: '#app', // 内部自带html模板
	/* render(h) {
		return h(App);
	} */
	render: h => h(App)
	// ...App // 因为App也有render方法所以可以直接这么写
});

// v-loader 编译时将.vue文件通过vue-template-compiler把template变成render函数


/* let arr = [1, 3, 4];
for (let i = 0; i < arr.length; i++) {
	if (arr[i] === 3) {
		return true;
	}
	console.log(arr[i]);
} */