import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import NavPath from '../../components/NavPath'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'

import 'antd/dist/antd.less'
import '../../styles/index.less'
import './index.less'

class App extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="ant-layout-aside">
                <Sidebar />
                <div className="ant-layout-main">
                    <Header />
                    <NavPath />
                    <div className="ant-layout-container">
                        <div className="ant-layout-content">
                            <ReactCSSTransitionGroup
                                component="div"
                                className="transition-wrapper"
                                transitionName="transition-wrapper"
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={300}
                            >
                                <div key={this.props.location.pathname} style={{width: '100%'}}>
                                    {this.props.children}
                                </div>
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;
