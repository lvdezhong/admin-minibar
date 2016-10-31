import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'

import action from '../../store/actions'

import './index.less'

const SubMenu = Menu.SubMenu

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Sidebar extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        this.props.action.getAllMenu()
    }

    menuClickHandle(item) {
        this.props.action.updateNavPath(item.keyPath, item.key)
    }

    render() {
        const { items } = this.props.state.menu;
        let openKey = []
        const menu = items.map((item) => {
            openKey.push('sub'+item.key)
            return (
                <SubMenu key={'sub'+item.key} title={<span><Icon type={item.icon} />{item.name}</span>}>
                    {item.child.map((node) => {
                        return (
                            <Menu.Item key={'menu'+node.key}><Link to={node.link}>{node.name}</Link></Menu.Item>
                        )
                    })}
                </SubMenu>
            )
        });
        return (
            <aside className="ant-layout-sider">
                <Menu mode="inline" theme="dark" defaultOpenKeys={openKey} onClick={this.menuClickHandle.bind(this)}>
                    {menu}
                </Menu>
            </aside>
        )
    }
}

export default Sidebar;
