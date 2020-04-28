export default {
	functional: true, //函数式组件 没有状态: 不能有data,props，没有this，不能实例化，开销比较小
	/* render(h, options) {
		console.log(this);// null
		console.log(options); // FunctionalRenderContext 作用域上下文， 有data， parent等属性
	} */
	render(h, {parent, data}) {
		let route = parent.$route;// 这个$route被放到了vue的原型上, 这就是当前的路径
		let depth = 0;// 默认渲染第一个

		// $vnode 占位符vnode $vnode: <router-view></router-view>
		// 渲染vnode _vnode: <router-view>内实际的内容 <div></div>
		// 就是查查自己是第几层，然后找到对应的组件进行渲染
		// console.log('父vue实例', parent);
		while(parent) {
			if (parent.$vnode && parent.$vnode.data.routerView) {
				depth++;
			} 
			parent = parent.$parent;
		}
		data.routerView = true;// <router-view>渲染之后就给这个router-view的data上加一个属性

		let record = route.matched[depth];
		if (!record) {
			return h();// 返回一个空的节点
		}
		return h(record.component, data);
	}
}