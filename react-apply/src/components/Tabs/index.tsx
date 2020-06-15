import React from 'react';
import { Link, NavLink, withRouter} from 'react-router-dom';
import { StarOutlined, ShoppingCartOutlined,UserOutlined } from '@ant-design/icons';

import './index.less';

interface Props {

}

function Tabs(_props: Props) {
    return (
        <footer>
            <NavLink exact to="/"><StarOutlined/><span>首页</span></NavLink>
            <NavLink exact to="/mine"><ShoppingCartOutlined /><span>购物车</span></NavLink>
            <NavLink exact to="/profile"><UserOutlined /><span>个人中心</span></NavLink>
        </footer>
    )
}

export default Tabs;

