import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
                            {this.props.children}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;
