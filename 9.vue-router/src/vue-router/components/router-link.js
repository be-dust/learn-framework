// 有属性的 tag="div"
export default {
	props: {
		to: {
			type: String,
			require: true
		},
		tag: {
			type: String,
			default: 'a'
		}
	},
	methods: {
		handler() {
			this.$router.push(this.to);
		}
	},
	render(h) {
		let tag = this.tag;
		// jsx 语法
		return <tag onClick={this.handler}>{this.$slots.default}</tag>
	}
}