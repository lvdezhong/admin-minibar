import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import NavPath from '../../components/NavPath'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'

import {fetchProfile, logout} from '../../actions/user'

import '../../styles/index.less'
import 'antd/dist/antd.less'
import './index.less'

class App extends React.Component {
    constructor() {
        super()
    }

    componentWillMount() {
        const { fetchProfile } = this.props;
        fetchProfile();
    }

    render() {
        const { user } = this.props;

        return (
            <div className="ant-layout-aside">
                <Sidebar />
                <div className="ant-layout-main">
                    <Header user={user} />
                    <NavPath />
                    <div className="ant-layout-container">
                        <div className="ant-layout-content">
                            {this.props.children}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { user } = state.user;

    return {
        user: user.user ? user.user : null
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProfile: bindActionCreators(fetchProfile , dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
