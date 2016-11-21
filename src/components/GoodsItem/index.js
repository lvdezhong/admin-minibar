import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import classNames from 'classnames'

import { price } from '../../utils'

import './index.less'

const propTypes = {
    closable: PropTypes.bool,
    onCancel: PropTypes.func,
    dataSource: PropTypes.object
}

const defaultProps = {
    closable: true
}

class GoodsItem extends React.Component{
    constructor() {
        super()
    }

    handleCancel() {
        this.props.onCancel();
    }

    render() {
        const { dataSource, closable } = this.props;

        const imgStyle = {
            backgroundImage: `url(${dataSource.img})`
        }

        let cancelClassName = classNames('cancel', {
            'hidden': !closable
        })

        return (
            <div className="goods-item-wrapper">
                <div className="goods-item-img" style={imgStyle}></div>
                <div className="goods-item-info">
                    <p className="goods-item-name">{dataSource.name}</p>
                    <p className="goods-item-price">¥ {price('GET', dataSource.price)}</p>
                </div>
                <Icon className={cancelClassName} onClick={this.handleCancel.bind(this)} type="close" />
            </div>
        )
    }
}

GoodsItem.propTypes = propTypes;
GoodsItem.defaultProps = defaultProps;

export default GoodsItem;
