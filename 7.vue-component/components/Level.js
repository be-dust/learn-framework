export default {
    props: {
        type: String | Number
    },
    data() {
        return {
            msg: 'xxx'
        }
    },
    methods: {
        handleClick(e) {
            console.log(e.target);
        },
        handleInput(e) {
            this.msg = e.target.value
        }
    },
    render(h) {
        // return h('h' + this.type, {}, [this.$slots.default])// 默认插槽取default
        // jsx: js+html
        let tag = 'h' + this.type;
        return <tag>
            {this.msg}<input type="text" value={this.msg} onInput={this.handleInput}/>
            <span value={tag} onclick={this.handleClick}>{this.$slots.default}</span>
        </tag>;

    }
}