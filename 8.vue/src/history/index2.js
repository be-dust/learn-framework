

import {
	h,
	render,
	patch
} from './vdom';

/* // 老的有孩子，新的没孩子
let oldVnode = h('div', {id: 'container',key: 1,class: 'my',style: {background: 'yellow'}},
	h('span', {style: {color: 'red'}}, 'hello'),
	'zx'
);
let newVnode = h('div', {id: 'aa', style: {background: 'blue'}}); */


/* // 老的没孩子，新的有孩子
let oldVnode = h('div', {id: 'container',key: 1,class: 'my',style: {background: 'yellow'}});
let newVnode = h('div', {id: 'aa', style: {background: 'blue'}},
	h('span', {style: {color: 'green'}}, 'world'),
	'px'
); */

// 老的有孩子，新的也有孩子
let oldVnode = h('div', {id: 'container',key: 1,class: 'my',style: {background: 'yellow'}},
	h('li', {style: {background: 'red'}, key: 'a'}, 'a'),
	h('li', {style: {background: 'yellow'}, key: 'b'}, 'b'),
	h('li', {style: {background: 'blue'}, key: 'c'}, 'c'),
	h('li', {style: {background: 'pink'}, key: 'd'}, 'd'),
);
let newVnode = h('div', {id: 'aa', style: {background: 'blue'}},
	h('li', {style: {background: 'pink'}, key: 'e'}, 'e'),
	h('li', {style: {background: 'red'}, key: 'a'}, 'a'),
	h('li', {style: {background: 'pink'}, key: 'f'}, 'f'),
	h('li', {style: {background: 'blue'}, key: 'c'}, 'c'),
	h('li', {style: {background: 'pink'}, key: 'n'}, 'n'),
); 

let app = document.getElementById('app');

render(oldVnode, app);

// patchVnode 用新的虚拟节点和老的虚拟节点做对比，更新真是dom元素
setTimeout(() => {
	patch(oldVnode, newVnode);// 这里比对的两个虚拟节点对应的都是同一个真实dom元素, 不同真实dom之间没有可比性
}, 1000);
