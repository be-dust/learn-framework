// 这个文件除了第一次初始化渲染外还要做比对操作
export function render(vnode, container) {// 让虚拟节点渲染成真实节点
	// console.log(container);
	let el = createElm(vnode);
	container.appendChild(el);
}

// 创建真实节点
function createElm(vnode) {
	let {tag, children, key, props, text} = vnode;
	if (typeof tag === 'string') {
		// 标签 
		// 一个虚拟节点对应这个他的真实节点
		vnode.el = document.createElement(tag);
		// 更新属性
		updateProperties(vnode);
		children.forEach(child => {
			return render(child, vnode.el);// 递归渲染当前孩子列表
		});
	} else {
		// 文本
		vnode.el = document.createTextNode(text);
	}
	return vnode.el;
}

// 后续更新的时候会新旧会做比较
// 第一次渲染时oldProps是undefined，后续更新时，oldProps就是上一次的内容
function updateProperties(vnode, oldProps={}) {
	let newProps = vnode.props || {};// 获取当前节点中的数据, 文本节点没有props
	let el = vnode.el;// 当前的真实节点
	
	let newStyle = newProps.style || {};
	let oldStyle = oldProps.style || {};

	for (let key in oldStyle) {
		if (!newStyle[key]) {
			el.style[key] = '';// 注意不能用delete删除el.style
		}
	}

	//下次更新时要用新的属性来更新老的虚拟节点
	// 1. 如果老的虚拟节点中有，新的没有，那就把老的删掉
	for (let key in oldProps) {
		if (!newProps[key]) {
			delete el[key];// 直接修改真实dom
		}
	}

	//先判断以前有没有这些属性
	for (let key in newProps) {
		if (key === 'style') {// 还需要遍历添加
			for(let styleName in newProps.style) {
				// el.style.color = 'red';
				el.style[styleName] = newProps.style[styleName]
			}
		} else if (key === 'class') {
			el.className = newProps.class;
		}else {
			el[key] = newProps[key];// 给节点添加属性
		}
	}
} 

export function patch(oldVnode, newVnode) {
	// console.log(oldVnode, newVnode);
	
	// 1. 先比对标签是否相同, 如果不一样直接拿新的替换老的
	if (oldVnode.tag !== newVnode.tag) {
		oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
	}

	// 2. 如果标签一样而且是文本，文本节点的tag是undefined
	if (!oldVnode.tag) {
		if(oldVnode.text !== newVnode.text) {
			oldVnode.el.textContent = newVnode.text;
		}
	}

	// 3. 标签一样， 不是undefined说明是常规的标签， 标签就可以复用老的标签
	let el = newVnode.el = oldVnode.el;
	updateProperties(newVnode, oldVnode);// 比较属性

	// 比较孩子
	let oldChildren = oldVnode.children || [];
	let newChildren = newVnode.children || [];

	if(oldChildren.length > 0 && newChildren.length > 0) {// 老的有孩子，新的也有孩子
		updateChildren(el, oldChildren, newChildren);
	} else if (oldChildren.length > 0) {// 老的有孩子，新的没孩子
		el.innerHTML = '';
	} else if (newChildren.length > 0) {// 老的没孩子，新的有孩子
		for (let i = 0; i < newChildren.length; i++) {
			let child = newChildren[i];
			el.appendChild(createElm(child));
		}
	}
	return el;
}
function isSameVnode(oldVnode, newVnode) {
	// key相同就可以复用真实节点
	return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}
function updateChildren(parent, oldChildren, newChildren) {
	// vue中的优化策略,因为在浏览器中操作dom最常见的方法就是开头或者结尾插入
	// 涉及到正序和倒序
	let oldStartIndex = 0;
	let oldStartVnode = oldChildren[0];
	let oldEndIndex = oldChildren.length -1;
	let oldEndVnode = oldChildren[oldChildren.length -1];

	let newStartIndex = 0;
	let newStartVnode = newChildren[0];
	let newEndIndex = newChildren.length -1;
	let newEndVnode = newChildren[newChildren.length -1];

	function makeIndexByKey(children) {
		let map = {};
		children.forEach((item, index) => {
			map[item.key] = index;
		});
		return map;// {a: 0, b: 1,...}
	}
	let map = makeIndexByKey(oldChildren);
	console.log('map', map);

	// 每一次循环都是按照1->2->3->4的顺序走的
	while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
		if (!oldStartVnode) {
			oldStartVnode = oldChildren[++oldStartIndex];
		} else if (!oldEndVnode){
			oldEndVnode = oldChildren[--oldEndIndex];
		}

		if (isSameVnode(oldStartVnode, newStartVnode)) {// 1. 先看前面是否一样, 向后插入
			patch(oldStartVnode, newStartVnode);// 用新的属性来更新老的属性, 递归比较孩子
			oldStartVnode = oldChildren[++oldStartIndex];// 指针后移，节点后移
			newStartVnode = newChildren[++newStartIndex];// 指针后移，节点后移
		} else if (isSameVnode(oldEndVnode, newEndVnode)){// 2. 先看后面是否一样， 向前插入
			patch(oldEndVnode, newEndVnode);
			oldEndVnode = oldChildren[--oldEndIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameVnode(oldStartVnode, newEndVnode)) {// 3. 老的头和新的尾是否一样, 倒序
			// a b c d => d c b a, 需要把老的a b c 依次移动到d后面， 注意移动的是真实的dom节点,我们的newChildren和oldChildren没有变
			patch(oldStartVnode, newEndVnode);
			parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling);
			oldStartVnode = oldChildren[++oldStartIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameVnode(oldEndVnode, newStartVnode)) {// 4. 老的尾和新的头是否一样
			// a b c d => d a b c， 先把老的d移动到前面，然后接着比较，
			patch(oldEndVnode, newStartVnode);
			parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
			oldEndVnode = oldChildren[--oldEndIndex];
			newStartVnode = newChildren[++newStartIndex];
		} else {// 5. 最复杂的一种情况，乱序而且不能复用
			// a b c d => e a f c n
			// 会先拿新节点的第一项去老节点中匹配， 如果匹配不到直接将这个节点插入到老节点开头的前面，能匹配到则直接移动老节点
			// 循环之后老节点中可能还有剩余，则直接删除老节点中剩余的属性

			let moveIndex = map[newStartVnode.key];
			// 没有匹配到
			if (moveIndex == undefined) {
				parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
			} else {
				// 匹配到了
				let moveVnode = oldChildren[moveIndex];
				oldChildren[moveIndex] = undefined;// 把移动了的那个老的节点赋值为undefined,作为占位,下一次比较直接跳过
				patch(moveVnode, newStartVnode);// 先比对
				parent.insertBefore(moveVnode.el, oldStartVnode.el);
			}
			// 新节点后移
			newStartVnode = newChildren[++newStartIndex];
		}
	}

	// 新的还没走完
	if (newStartIndex <= newEndIndex) {
		for (let i = newStartIndex; i <= newEndIndex; i++) {
			// 如果是往后插入可以用appendChild
			// parent.appendChild(createElm(newChildren[i]));

			// for的最后一次循环，newEndIndex往后移动一位，如果是前插就找到了第一个元素，如果是后插的话就是null,当ele为null时就相当于是appendChild
			let ele = newChildren[newEndIndex+1] == null ? null : newChildren[newEndIndex+1].el;
			parent.insertBefore(createElm(newChildren[i]), ele);
		}
	}
	// 旧的还没走完
	if (oldStartIndex <= oldEndIndex) {
		for(let i = oldStartIndex; i <= oldEndIndex; i++) {
			let child = oldChildren[i];
			if (child != undefined) {
				parent.removeChild(child.el);
			}
		}
	}
}