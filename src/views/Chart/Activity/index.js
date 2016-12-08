import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Select, Card, Row, Col, DatePicker, message, Radio } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment';

import action from '../../../store/actions'
import { getDayCount } from '../../../utils'

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class activityChart extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {

    }

    handleSubmit() {

    }

    handleClick(AddDayCount) {
        this.props.form.setFieldsValue({
            time: [moment(getDayCount(AddDayCount)), moment(new Date())]
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const defaultTime = [moment(getDayCount(-7)), moment(new Date())];

        return (
            <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={40}>
                            <Col span={12}>
                                <FormItem label="操作时间" {...formItemLayout} style={{ marginBottom: '0' }}>
                                    {getFieldDecorator('time', { initialValue: defaultTime })(
                                        <RangePicker style={{ width: 200 }} />
                                    )}
                                    <span className="ant-form-text" style={{paddingLeft: '8px'}}>
                                        <ButtonGroup size="small">
                                            <Button type="ghost" onClick={this.handleClick.bind(this, -7)}>最近7天</Button>
                                            <Button type="ghost" onClick={this.handleClick.bind(this, -30)}>最近30天</Button>
                                        </ButtonGroup>
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="酒店名称" {...formItemLayout}>
                                    {getFieldDecorator('hotel', { initialValue: '' })(
                                        <Select size="default">
                                            <Option value="">全部</Option>
                                            <Option value="1">成功</Option>
                                            <Option value="0">失败</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={16} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">筛选</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

            </div>
        )
    }
}

activityChart = Form.create()(activityChart);

export default activityChart;
