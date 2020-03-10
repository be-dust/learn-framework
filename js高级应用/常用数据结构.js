// 队列， 栈， hash表， 图， 数， 链表

// 队列：first in first out， 数组： push -> shift

// 栈： 后进的先出, 水杯， push -> pop, js执行上下文的创建和销毁 就是典型的栈结构

function a() {
	function b() {
		function c() {

		}
		c();
	}
	b();
}
a();

// map es6， 查找快
// 集合 set， 可以放不重复的项

