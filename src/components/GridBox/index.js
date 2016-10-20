import React from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { Icon } from 'antd'
import { CLICK_GOODS_ITEM, price } from '../../utils'

import './index.less'

class GridBox extends React.Component {
    constructor() {
        super()
    }

    handleClick() {
        PubSub.publish(CLICK_GOODS_ITEM, this.props.currentIndex);
    }

    render() {
        const { currentIndex, keyword, height } = this.props;

        switch (keyword) {
            case 'device':
                var info = this.props.deviceGoods[currentIndex]
                break;
            case 'maintpl':
                var info = this.props.mainTplGoods[currentIndex]
                break;
        }

        const gridStyle = {
            height: height
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

function mapStateToProps(state) {
    const { machine_item_list } = state.device.currentDevice;
    const { tmpl_item_list } = state.maintpl.currentMainTpl;
    return {
        deviceGoods: machine_item_list,
        mainTplGoods: tmpl_item_list
    }
}

export default connect(mapStateToProps)(GridBox)
