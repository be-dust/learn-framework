	export function vnode(tag, props, key, children, text) {
		return {
			tag,
			props,
			key, // 唯一标识 用户可能传递
			children,
			text
		}
	}