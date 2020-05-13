import { vnode } from './create-element';

export default function h(tag, props, ...children) {
	let key = props.key;
	delete props.key; // 属性不包括key， key不是dom自带属性, 我们渲染之后检查元素不会有key属性

	children = children.map(child => {
		if (typeof child === 'object') {
			return child;
		} else {
			return vnode(undefined, undefined, undefined, undefined, child);// 文本节点
		}
	});
	
	return vnode(tag, props, key, children);
}