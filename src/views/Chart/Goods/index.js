import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Card, Row, Col, DatePicker, message, Radio } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import action from '../../../store/actions'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class goodsChart extends React.Component {
    constructor() {
        super()
    }

    handleSubmit() {

    }

    handleChange() {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        }
        const data1 = [
            {goods: '香蕉', look: 4000},
            {goods: '苹果', look: 3000},
            {goods: '梨子', look: 2000},
            {goods: '西瓜', look: 2780},
            {goods: '橘子', look: 1890},
        ]
        const data2 = [
            {goods: '香蕉', pay: 4000},
            {goods: '苹果', pay: 3000},
            {goods: '梨子', pay: 2000},
            {goods: '西瓜', pay: 2780},
            {goods: '橘子', pay: 1890},
        ]
        const data3 = [
            {goods: '香蕉', price: 4000},
            {goods: '苹果', price: 3000},
            {goods: '梨子', price: 2000},
            {goods: '西瓜', price: 2780},
            {goods: '橘子', price: 1890},
        ]

        return (
            <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="操作时间" {...formItemLayout} style={{ marginBottom: '0' }}>
                                    {getFieldDecorator('time', { initialValue: '' })(
                                        <RangePicker style={{ width: 200 }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">筛选</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="ui-box">
                    <Card title="分布">
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup defaultValue="1" onChange={this.handleChange.bind(this)}>
                                    <RadioButton value="1">TOP10</RadioButton>
                                    <RadioButton value="2">TOP30</RadioButton>
                                </RadioGroup>
                            </div>
                            <BarChart
                                width={1000}
                                height={350}
                                data={data1}
                            >
                                <XAxis dataKey="goods" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="look" name="浏览次数" fill="#8884d8" />
                            </BarChart>
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup defaultValue="1" onChange={this.handleChange.bind(this)}>
                                    <RadioButton value="1">TOP10</RadioButton>
                                    <RadioButton value="2">TOP30</RadioButton>
                                </RadioGroup>
                            </div>
                            <BarChart
                                width={1000}
                                height={350}
                                data={data2}
                            >
                                <XAxis dataKey="goods" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pay" name="支付次数" fill="#8884d8" />
                            </BarChart>
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup defaultValue="1" onChange={this.handleChange.bind(this)}>
                                    <RadioButton value="1">TOP10</RadioButton>
                                    <RadioButton value="2">TOP30</RadioButton>
                                </RadioGroup>
                            </div>
                            <BarChart
                                width={1000}
                                height={350}
                                data={data3}
                            >
                                <XAxis dataKey="goods" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="price" name="成交额" fill="#8884d8" />
                            </BarChart>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

goodsChart = Form.create()(goodsChart);

export default goodsChart;
