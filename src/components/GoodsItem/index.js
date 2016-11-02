import React from 'react'

import './index.less'

class GiftItem extends React.Component{
    constructor() {
        super()
    }

    render() {
        const imgStyle = {
            backgroundImage: `url(${this.props.img})`
        }

        return (
            <div className="goods-item-wrapper">
                <div className="goods-item-img" style={imgStyle}></div>
                <div className="goods-item-info">
                    <p className="goods-item-name">{this.props.name}</p>
                    <p className="goods-item-price">¥ {this.props.price}</p>
                </div>
            </div>
        )
    }
}

export default GiftItem;
