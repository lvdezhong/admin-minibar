import React from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { Icon } from 'antd'
import { CLICK_GOODS_ITEM, price } from '../../utils'

import './index.less'

@connect(
    state => ({state: state})
)

class GridBox extends React.Component {
    constructor() {
        super()
    }

    handleClick() {
        PubSub.publish(CLICK_GOODS_ITEM, this.props.currentIndex);
    }

    render() {
        const { currentIndex, keyword, height, active } = this.props;

        switch (keyword) {
            case 'device':
                const { machine_item_list } = this.props.state.device.currentDevice;
                var info = machine_item_list[currentIndex]
                break;
            case 'maintpl':
                const { tmpl_item_list } = this.props.state.maintpl.currentMainTpl;
                var info = tmpl_item_list[currentIndex]
                break;
        }

        const gridStyle = {
            height: height
        }

        if (active == currentIndex) {
            gridStyle.borderColor = 'red'
        }

        const imgStyle = {
            backgroundImage: `url(${info && info.image_vertical})`,
            height: height - 46
        }

        let maskStyle = {
            height: height - 46
        }

        if (info && info.status == 0) {
            maskStyle.display = 'block';
        }

        return (
            <div className="grid" style={gridStyle} onClick={this.handleClick.bind(this)}>
                <div className="grid-top">
                    <span className="text"><Icon type="plus" />添加商品</span>
                    <div className="img" style={imgStyle}></div>
                    <div className="mask" style={maskStyle}></div>
                </div>
                <div className="grid-bottom">
                    <p className="price">¥{info && price('GET', info.price)}</p>
                    <p className="name">{info && info.name}</p>
                </div>
            </div>
        )
    }
}

export default GridBox;
