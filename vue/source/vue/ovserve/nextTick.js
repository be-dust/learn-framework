let callbacks = [];
function flushCallbacks() {
	callbacks.forEach(cb => cb());
	callbacks = [];
}
export function nextTick(cb) { // cb就是flushQueue
	callbacks.push(cb);

	// 异步刷新这个callbacks， 使用一个异步方法
	// 异步方法采用优先级：promise, mutationObserver， setImmediate，setTimeout 
	let timerFunc = () => {
		flushCallbacks();
	}

	if (Promise) {
		console.log('使用Promise异步批量更新');
		return Promise.resolve().then(timerFunc);// then方法是一个异步方法
	}

	if (MutationObserver) {
		let observer = new MutationObserver(timerFunc);// timerFunc是异步执行的
		let textNode = document.createTextNode(1);
		observer.observe(textNode, {characterData: true});
		textNode.textContent = 2;
		return;
	}

	if (setImmediate) {
		console.log('setImmediate');
		return setImmediate(timerFunc);
	}

	setTimeout(timerFunc, 0);
}

/* 等待页面更新之后再去获取dom元素, 这个是我们自己写的，需要放在flushQueue之后
```
Vue.nextTick(() => {})
``` */