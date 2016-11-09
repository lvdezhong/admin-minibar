import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'
import PubSub from 'pubsub-js'

import action from '../../store/actions'
import { CLICK_GOODS_ITEM } from '../../utils'

import GridBox from '../GridBox'
import GridForm from '../GridForm'

import './index.less'

const defaultItem = {
    name: "默认",
    origin_price: "0.00",
    price: "",
    stock_num: "",
    max_stock_num: "",
    status: 1,
    content_type: 0,
    isDefault: true
}

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Shelves extends React.Component {
    constructor() {
        super()
        this.state = {
            active: 0
        }
    }

    componentWillUpdate(nextProps) {
        const { keyword } = nextProps;

        switch (keyword) {
            case 'device':
                const machine_item_list = nextProps.state.device.currentDevice.machine_item_list || [];

                if (machine_item_list.length == 0 || machine_item_list.length < 7) {
                    this.props.action.pushDeviceDefaultItem(defaultItem, 7);
                }
                break;
            case 'maintpl':
                const tmpl_item_list = nextProps.state.maintpl.currentMainTpl.tmpl_item_list || [];

                if (tmpl_item_list.length == 0 || tmpl_item_list.length < 7) {
                    this.props.action.pushMainTplDefaultItem(defaultItem, 7);
                }
                break;
        }
    }

    componentDidMount() {
        this.pubsub_token = PubSub.subscribe(CLICK_GOODS_ITEM, function(msg, data) {
            this.setState({
                active: data.index
            });
        }.bind(this));
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }

    render() {
        const { keyword } = this.props;
        const { active } = this.state;

        switch (keyword) {
            case 'device':
                const { machine_item_list } = this.props.state.device.currentDevice;
                var goods = machine_item_list || [];
                break;
            case 'maintpl':
                const { tmpl_item_list } = this.props.state.maintpl.currentMainTpl;
                var goods = tmpl_item_list || [];
                break;
        }

        if (goods.length == 0) {
            return false;
        }

        return (
            <div className="vending-config">
                <div className="vending-model">
                    <Row>
                        <Col span={6}>
                            <Row>
                                <Col span={24}><GridBox active={active} height={125} currentIndex="0" keyword={keyword} /></Col>
                            </Row>
                            <Row>
                                <Col span={24}><GridBox active={active} height={125} currentIndex="1" keyword={keyword} /></Col>
                            </Row>
                        </Col>
                        <Col span={12}><GridBox active={active} height={250} currentIndex="2" keyword={keyword} /></Col>
                        <Col span={6}><GridBox active={active} height={250} currentIndex="3" keyword={keyword} /></Col>
                    </Row>
                    <Row>
                        <Col span={8}><GridBox active={active} height={155} currentIndex="4" keyword={keyword} /></Col>
                        <Col span={8}><GridBox active={active} height={155} currentIndex="5" keyword={keyword} /></Col>
                        <Col span={8}><GridBox active={active} height={155} currentIndex="6" keyword={keyword} /></Col>
                    </Row>
                </div>
                <div className="vending-form">
                    <GridForm keyword={keyword} />
                </div>
            </div>
        )
    }
}

export default Shelves;
