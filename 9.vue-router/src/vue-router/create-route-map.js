
export default function createRouteMap(routes, oldPathList, oldPathMap) {
	let pathList = oldPathList || [];
	let pathMap = oldPathList || Object.create(null);
	// 数组的扁平化
	routes.forEach(route => {
		// addRouteRecord 根据用户的路由配置实现格式化数据
		addRouteRecord(route, pathList, pathMap);
	});
	console.log('pathMap', pathMap);
	return {
		pathList,
		pathMap
	}
}


function addRouteRecord(route, pathList, pathMap, parent) {
	// 记录父子关系
	let path = parent ? parent.path + '/' + route.path : route.path;
	let record = {
		path,
		component: route.component,
		// todo...
		parent
	}
	if( !pathMap[path]) {
		pathList.push(path);
		pathMap[path] = record;
	}
	if (route.children) {
		route.children.forEach(route => {
			addRouteRecord(route, pathList, pathMap, record);
		});
	}
}