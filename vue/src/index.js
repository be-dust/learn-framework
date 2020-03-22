import Vue from 'vue';

let vm = new Vue({
	el: '#app',
	data() {
		return {
			msg: 'hello world'
		};
	},
	render(h) {
		// return h('p', {id: 'a'}, 'hello')
		return h('p', {id: 'a'}, this.msg);// vue内部会调用此render方法，将render方法中的this变为当前vm实例，这样就能取到msg
	}
});

setTimeout(() => {
	vm.msg = 'i am zhangxing';
}, 1000);