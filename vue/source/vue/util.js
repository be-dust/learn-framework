
// ?:匹配不捕获, 不捕获当前的分组， 就像这个例子 ((?:.|\r?\n)+?) 如果不加 ?: 那么最终结果就是两个分组，加了之后里面的那个分组就不要了只剩下外面的哪一个分组 
// + 至少一个
// ? 取消贪婪 尽可能少匹配
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
export const util = {
	getValue(vm, expr) {
		let keys = expr.split('.');// vm.school.name
		// 也可以用循环方式
		return keys.reduce((memo, current)	 => {
			memo = memo[current];
			return memo;
		}, vm);
	},
	compilerText(node, vm) {// 编译文本， 替换{{school.name}}
		if (!node.expr) {// 第一次渲染的时候node.expr为undefined
			node.expr = node.textContent;// 给节点增加一个自定义属性为了保存第一次渲染时的{{school.nmae}}，这样之后的每次更新都是拿着{{school.name}}去匹配，否则的话之后的更新就无法匹配到{{school.name}}也就无法实现更新。
		}
		node.textContent = node.expr.replace(defaultRE, function(...args) {
			// console.log(args);
			// return util.getValue(vm, args[1]);
			return JSON.stringify(util.getValue(vm, args[1]));
		});
		/* 这么写当数据进行更新之后就无法拿到最初的{{school.name}}模板了
		node.textContent = node.textContent.replace(defaultRE, function(...args) {
			// console.log(args);
			return util.getValue(vm, args[1]);
		}); */
	}
}

// vue1.0写法
export function compiler(node, vm) {// node就是文档碎片
	let childNodes = node.childNodes;
	// 将类数组转化为数组
	[...childNodes].forEach(child => {
		if (child.nodeType == 1) {// 1元素 3文本
			compiler(child, vm);// 编译当前元素的孩子节点
		} else if (child.nodeType == 3) {
			util.compilerText(child, vm);
		}
	})
}

export function query(el) {
	if (typeof el === 'string') {
		return document.querySelector(el);
	}
	return el;
}