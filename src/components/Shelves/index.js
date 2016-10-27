import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'
import PubSub from 'pubsub-js'

import { pushDeviceDefaultItem } from '../../actions/device'
import { pushMainTplDefaultItem } from '../../actions/maintpl'
import { CLICK_GOODS_ITEM } from '../../utils'

import GridBox from '../GridBox'
import GridForm from '../GridForm'

import './index.less'

const defaultProps = {
    deviceGoods: [],
    mainTplGoods: []
}

const defaultItem = {
    name: "默认",
    origin_price: "0.00",
    price: "",
    stock_num: "",
    max_stock_num: "",
    status: 1,
    isDefault: true
}

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
                if (nextProps.deviceGoods.length == 0 || nextProps.deviceGoods.length < 7) {
                    this.props.pushDeviceDefaultItem(defaultItem, 7);
                }
                break;
            case 'maintpl':
                if (nextProps.mainTplGoods.length == 0 || nextProps.mainTplGoods.length < 7) {
                    this.props.pushMainTplDefaultItem(defaultItem, 7);
                }
                break;
        }
    }

    componentDidMount() {
        this.pubsub_token = PubSub.subscribe(CLICK_GOODS_ITEM, function(msg, data) {
            this.setState({
                active: data
            });
        }.bind(this));
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }

    render() {
        const { deviceGoods, mainTplGoods, keyword } = this.props;
        const { active } = this.state;

        switch (keyword) {
            case 'device':
                var goods = deviceGoods;
                break;
            case 'maintpl':
                var goods = mainTplGoods;
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

Shelves.defaultProps = defaultProps;

function mapStateToProps(state) {
    const { machine_item_list } = state.device.currentDevice;
    const { tmpl_item_list } = state.maintpl.currentMainTpl;
    return {
        deviceGoods: machine_item_list,
        mainTplGoods: tmpl_item_list
    }
}

function mapDispatchToProps(dispatch) {
    return {
        pushDeviceDefaultItem: bindActionCreators(pushDeviceDefaultItem, dispatch),
        pushMainTplDefaultItem: bindActionCreators(pushMainTplDefaultItem, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shelves)
