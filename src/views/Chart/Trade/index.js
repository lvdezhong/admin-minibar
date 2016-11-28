import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Card, Row, Col, DatePicker, message, Radio } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import action from '../../../store/actions'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class tradeChart extends React.Component {
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
            {time: '2016-12-23', home: 4000, detail: 2400, pay: 2400},
            {time: '2016-12-24', home: 3000, detail: 1398, pay: 2210},
            {time: '2016-12-25', home: 2000, detail: 9800, pay: 2290},
            {time: '2016-12-26', home: 2780, detail: 3908, pay: 2000},
            {time: '2016-12-27', home: 1890, detail: 4800, pay: 2181},
            {time: '2016-12-28', home: 2390, detail: 3800, pay: 2500},
            {time: '2016-12-29', home: 3490, detail: 4300, pay: 2100},
        ]
        const data2 = [
            {time: '2016-12-23', price: 4000},
            {time: '2016-12-24', price: 3000},
            {time: '2016-12-25', price: 2000},
            {time: '2016-12-26', price: 2780},
            {time: '2016-12-27', price: 1890},
            {time: '2016-12-28', price: 2390},
            {time: '2016-12-29', price: 3490},
        ]

        return (
            <div>
                <div className="ui-box">
                    <Card title="概况">
                        哈哈说
                    </Card>
                </div>
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
                    <Card title="统计">
                        哈哈说
                    </Card>
                </div>
                <div className="ui-box">
                    <Card title="趋势">
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup defaultValue="1" onChange={this.handleChange.bind(this)}>
                                    <RadioButton value="1">浏览人数</RadioButton>
                                    <RadioButton value="2">转化率</RadioButton>
                                </RadioGroup>
                            </div>
                            <LineChart
                                width={1000}
                                height={350}
                                data={data1}
                            >
                                <XAxis dataKey="time" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="home" name="首页" stroke="#8884d8" />
                                <Line type="monotone" dataKey="detail" name="详情页" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="pay" name="付款人数" stroke="#ff7300" />
                            </LineChart>
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup defaultValue="1">
                                    <RadioButton value="1">客单价</RadioButton>
                                </RadioGroup>
                            </div>
                            <LineChart
                                width={1000}
                                height={350}
                                data={data2}
                            >
                                <XAxis dataKey="time" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="price" name="客单价" stroke="#8884d8" />
                            </LineChart>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

tradeChart = Form.create()(tradeChart);

export default tradeChart;
