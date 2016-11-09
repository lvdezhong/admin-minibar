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

    handleClick(type) {
        PubSub.publish(CLICK_GOODS_ITEM, {
            index: this.props.currentIndex,
            type: type
        });
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

        if (info.content_type == 1) {
            var elem = <div className="grid-task">活动</div>
        } else {
            if (info.status == 0) {
                maskStyle.display = 'block';
            }

            var elem = <div>
                <div className="grid-top">
                    <span className="text"><Icon type="plus" />添加商品<br />或 营销活动</span>
                    <div className="img" style={imgStyle}></div>
                    <div className="mask" style={maskStyle}></div>
                </div>
                <div className="grid-bottom">
                    <p className="price">¥{info && price('GET', info.price)}</p>
                    <p className="name">{info && info.name}</p>
                </div>
            </div>
        }

        return (
            <div className="grid" style={gridStyle} onClick={this.handleClick.bind(this, info.content_type)}>
                {elem}
            </div>
        )
    }
}

export default GridBox;
