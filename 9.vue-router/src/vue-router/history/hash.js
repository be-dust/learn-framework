import History from './base';

function ensureSlash(params) {
	if (window.location.hash) {// 火狐不兼容
		return;
	}
	window.location.hash = '/';
}

class HashHistory extends History {
	constructor(router) {
		super(router);
		this.router = router;

		ensureSlash();// 保证页面一加载就要有hash值
	}
	getCurrentLocation() {
		return window.location.hash.slice(1);// 拿到除了#， 后面的东西 
	}
}

export default HashHistory;