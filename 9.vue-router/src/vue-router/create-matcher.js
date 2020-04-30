
import createRouteMap from './create-route-map'; 
import { createRoute } from './history/base';

export default function createMatcher(routes) {
	// 将数据扁平化
	// pathList表示所有路径的集合, ['/about', '/about/a']
	// pathMap {’/‘ : record, ’/about‘: record}
	let {pathList, pathMap} = createRouteMap(routes);
	// console.log(pathList, pathMap);
	// 类比store.registerModule()
	function addRoutes() {
		// 重载功能
		createRouteMap(routes, pathList, pathMap);
	}

	// 匹配对应记录， 给我一个路径，返回匹配到的记录
	function match(location) {
		let record = pathMap[location];// about/a 其实对应的是两条数据 about 和 about/a, 因此需要使用createRoute处理,返回匹配到所有的记录
		return createRoute(record, {
			path: location
		});
	}	

	return {
		addRoutes, 
		match
	}
}