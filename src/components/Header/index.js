import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown, message } from 'antd'
import { Link, browserHistory } from 'react-router'
import { logout } from '../../actions/user'

import './index.less'

const SubMenu = Menu.SubMenu;

class Header extends React.Component {
    constructor() {
        super()
    }

    handleClick(e) {
        const { logout } = this.props;

        switch (e.key) {
            case 'logout':
                logout().payload.promise.then(function(data) {
                    const { code, msg } = data.payload;

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
        const { user } = this.props;

        return (
            <div className='ant-layout-header'>
                <Menu className="header-menu" onClick={this.handleClick.bind(this)} mode="horizontal">
                    <SubMenu title={<span><Icon type="user" />{user && user.mobile}</span>}>
                        <Menu.Item key="logout">注销</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { user } = state.user;

    return {
        user: user.user ? user.user : null
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: bindActionCreators(logout, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
