import elMenu from "./el-menu";
import elMenuItem from "./el-menu-item";
import elSubmenu from "./el-submenu";

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    render() {
        let renderChildren = (data) => {
            return data.map(child => {
                return child.children ? 
                <elSubmenu>
                    <div slot="title">{child.title}</div>
                    {renderChildren(child.children)}
                </elSubmenu> 
            : <elMenuItem>{child.title}</elMenuItem>
            })
        }

        return <elMenu>
            {renderChildren(this.data)}
        </elMenu>
    }
}