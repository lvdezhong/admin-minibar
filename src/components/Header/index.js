import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown, message } from 'antd'
import { Link, browserHistory } from 'react-router'

import action from '../../store/actions'

import './index.less'

const SubMenu = Menu.SubMenu;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Header extends React.Component {
    constructor() {
        super()
    }

    componentWillMount() {
        this.props.action.fetchProfile();
    }

    handleClick(e) {
        switch (e.key) {
            case 'logout':
                this.props.action.logout().then(function(data) {
                    const { code, msg } = data.value;

                    if (code == 10000) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('uid');
                        localStorage.removeItem('mobile');

                        browserHistory.push('/login');
                    } else {
                        message.error(msg)
                    }
                })
            default:
                return;
        }
    }

    render() {
        const { user } = this.props.state.user;

        return (
            <div className='ant-layout-header'>
                <Menu className="header-menu" onClick={this.handleClick.bind(this)} mode="horizontal">
                    <SubMenu title={<span><Icon type="user" />{user.user && user.user.mobile}</span>}>
                        <Menu.Item key="logout">注销</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}

export default Header;
