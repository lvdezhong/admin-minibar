import React from 'react'
import { connect } from 'react-redux'
import PubSub from 'pubsub-js'
import { Icon } from 'antd'
import { price } from '../../utils'

import './index.less'

@connect(
    state => ({state: state})
)

class GridBox extends React.Component {
    constructor() {
        super()
    }

    handleClick(type) {
        PubSub.publish('clickGoodsItem', {
            index: this.props.currentIndex
        });
    }

    render() {
        const { currentIndex, dataSource, height, active, imgType } = this.props;

        const gridStyle = {
            height: height
        }
        if (active == currentIndex) {
            gridStyle.borderColor = 'red'
        }

        const imgStyle = {
            height: height - 46
        }
        if (imgType == 1) {
            imgStyle.backgroundImage = `url(${dataSource.image_horizontal})`;
        } else {
            imgStyle.backgroundImage = `url(${dataSource.image_vertical})`;
        }

        const maskStyle = {
            height: height - 46
        }
        if (dataSource.status == 0) {
            maskStyle.display = 'block';
        }

        const gridTaskStyle = {
            height: height - 12
        }

        if (dataSource.content_type == 1) {
            var elem = <div className="grid-task" style={gridTaskStyle}>
                <div className="mark"><span>送</span></div>
                <div className="gift"></div>
                <div className="describe">
                    <p>免费送哟～</p>
                    <p className="slogan">SURPRISE!</p>
                </div>
            </div>
        } else {
            var elem = <div>
                <div className="grid-top">
                    <span className="text"><Icon type="plus" />添加商品<br />或 营销活动</span>
                    <div className="img" style={imgStyle}></div>
                    <div className="mask" style={maskStyle}></div>
                </div>
                <div className="grid-bottom">
                    <p className="price">¥{price('GET', dataSource.price)}</p>
                    <p className="name">{dataSource.name}</p>
                </div>
            </div>
        }

        return (
            <div className="grid" style={gridStyle} onClick={this.handleClick.bind(this)}>
                {elem}
            </div>
        )
    }
}

export default GridBox;
