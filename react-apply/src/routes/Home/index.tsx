import React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'
import HomeHeader from './components/HomeHeader';
import { CombinedState } from '@/typings/state';// CombinedState是根状态
import {HomeState} from '@/typings/state';
import mapDispatchToProps from '@/store/actions/home';

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

function Home(props: Props) {
    return (
        <>
            <HomeHeader></HomeHeader>
        </>
    )
}

const mapStateToProps = (state: CombinedState): HomeState => state.home; // 传进去根状态，返回Home状态

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

/**
 * 此组件是由路由渲染出来的
 * 所以属性对象包括路由属性RouteComponentProps
 */