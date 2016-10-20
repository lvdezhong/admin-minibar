import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Form, Row, Col, Input, Select, Button, Table, Tag, Pagination, DatePicker } from 'antd'

import { getOrder } from '../../../actions/order'
import { getAllDevice } from '../../../actions/device'

import { price } from '../../../utils'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class OrderList extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 1
        }
        this.paginationCfg = {
           count: 10,
           offset: 0
        }
        this.timeData = {
            start_time: '',
            end_time:''
        }
        this.postData = {
            status: 0
        }
    }

    handleChange(page) {
        this.paginationCfg.offset = (page - 1) * this.paginationCfg.count;
        this.postData = Object.assign(this.postData, this.paginationCfg);

        this.setState({
            current: page,
        });

        this.props.getOrder(this.postData);
    }

    handleSubmit(e) {
        e.preventDefault();

        const { getOrder } = this.props;
        const formData = Object.assign(this.props.form.getFieldsValue(), this.timeData);

        this.paginationCfg.offset = 0;
        this.postData = Object.assign(formData, this.paginationCfg);

        this.setState({
            current: 1
        });

        getOrder(this.postData);
    }

    handleTimeChange(dates, dateStrings) {
        this.timeData.start_time = dateStrings[0] + ' 00:00:00';
        this.timeData.end_time = dateStrings[1] + ' 00:00:00';
    }

    componentDidMount() {
        const { getOrder, getAllDevice } = this.props;

        getOrder(this.postData, this.paginationCfg);
        getAllDevice({
            offset: 0,
            count: 1000
        });
    }

    render() {
        const { order, device } = this.props
        const orderStatus = {
            10: "未支付",
            20: "订单取消",
            30: "已支付",
            40: "已出货",
            50: "出货失败"
        }

        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        }

        const { getFieldDecorator } = this.props.form

        let orderList = [];

        if (order.order_list) {
            orderList = order.order_list.map((item, index) => {
                return (
                    <tr key={index}>
                        <td colSpan="6">
                            <table className="order-item-table">
                                <tbody>
                                    <tr>
                                        <td colSpan="6">
                                            <div className="order-title">
                                                <div className="title-info-left">
                                                    <span>订单号：{item.order_sn}</span>
                                                    <span>{item.order_time}</span>
                                                </div>
                                                <div className="title-info-right">
                                                    <span>{item.machine.hotel.name}-{item.machine.room_number}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30%">
                                            <div className="goods">
                                                <div className="img" style={{backgroundImage: `url(${item.order_item_list[0].item_image_url})`}}></div>
                                                <p>{item.order_item_list[0].item_name}</p>
                                            </div>
                                        </td>
                                        <td width="15%">{price('GET', item.order_item_list[0].unit_price)} / {item.order_item_list[0].number}</td>
                                        <td width="15%">{item.username}</td>
                                        <td width="15%">微信</td>
                                        <td width="15%">{price('GET', item.total_amount)}</td>
                                        <td width="10%">{orderStatus[item.order_status]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                )
            });
        }

        let options = device.map((item) => {
            return (
                <Option key={item.id} value={item.id.toString()}>{item.machine_sn}</Option>
            )
        });

        options.unshift(<Option key="0" value="">全部</Option>);

        return (
            <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={16}>
                            <Col sm={8}>
                                <FormItem label="订单号" {...formItemLayout}>
                                    {getFieldDecorator('order_sn', { initialValue: '' })(
                                        <Input placeholder="请输入订单号" />
                                    )}
                                </FormItem>
                                <FormItem label="下单时间" {...formItemLayout}>
                                    <RangePicker style={{ width: 200 }} onChange={this.handleTimeChange.bind(this)} />
                                </FormItem>
                            </Col>
                            <Col sm={8}>
                                <FormItem label="订单状态" {...formItemLayout}>
                                    {getFieldDecorator('status', { initialValue: '0' })(
                                        <Select size="default">
                                            <Option value="0">全部</Option>
                                            <Option value="10">未支付</Option>
                                            <Option value="20">订单取消</Option>
                                            <Option value="30">已支付</Option>
                                            <Option value="40">已出货</Option>
                                            <Option value="50">出货失败</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col sm={8}>
                                <FormItem label="售货机" {...formItemLayout}>
                                    {getFieldDecorator('machine_id', { initialValue: '' })(
                                        <Select size="default">
                                            {options}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">筛选</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="clearfix">
                    <div className="order-table">
                        <table>
                            <thead>
                                <tr>
                                    <th width="30%">商品信息</th>
                                    <th width="15%">单价/数量</th>
                                    <th width="15%">买家</th>
                                    <th width="15%">支付方式</th>
                                    <th width="15%">实付金额</th>
                                    <th width="10%">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderList}
                            </tbody>
                        </table>
                    </div>
                    <div className="order-pagination">
                        <Pagination current={this.state.current} onChange={this.handleChange.bind(this)} total={order.total_count} showTotal={total => `共 ${total} 条`} />
                    </div>
                </div>
            </div>
        )
    }
}

OrderList = Form.create()(OrderList);

function mapStateToProps(state) {
    const { order, device, isPending, errors } = state.order;
    return {
        order: order,
        isPending: isPending,
        device: device,
        errors: errors
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOrder: bindActionCreators(getOrder, dispatch),
        getAllDevice: bindActionCreators(getAllDevice, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)
