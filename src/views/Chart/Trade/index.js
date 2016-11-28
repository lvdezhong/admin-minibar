import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Row, Col, Modal, Table, message } from 'antd'

import action from '../../../store/actions'

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class tradeChart extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>haha</div>
        )
    }
}

export default tradeChart;
