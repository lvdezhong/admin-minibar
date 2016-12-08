import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Select, Card, Row, Col, DatePicker, message, Radio } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
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
        this.state = {
            partType: 0,
            buyType: 0
        }
    }

    componentDidMount() {
        this.id = this.props.params.id;

        this.props.action.getHotel({
            offset: 0,
            count: 1000
        }).then((data) => {
            const formData = this.getFormData();

            this.props.action.getActivityData({
                start_time: formData.start_time,
                end_time: formData.end_time,
                hotel_id_list: JSON.stringify(formData.hotel),
                task_id: this.id
            })
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = this.getFormData();

        this.props.action.getActivityData({
            start_time: formData.start_time,
            end_time: formData.end_time,
            hotel_id_list: JSON.stringify(formData.hotel),
            task_id: this.id
        });
    }

    handleChange(key, e) {

    }

    handleClick(AddDayCount) {
        this.props.form.setFieldsValue({
            time: [moment(getDayCount(AddDayCount)), moment(new Date())]
        });
    }

    getFormData() {
        let formData = this.props.form.getFieldsValue();
        formData.start_time = formData.end_time = '';

        if (formData.time != '') {
            formData.start_time = formData.time[0].format('YYYY-MM-DD');
            formData.end_time = formData.time[1].format('YYYY-MM-DD');
        }
        delete formData.time;

        return formData
    }

    render() {
        const { hotel } = this.props.state.chart;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const defaultTime = [moment(getDayCount(-7)), moment(new Date())];
        const options = [];
        const defaultValue = [];

        _.each(hotel, (item) => {
            options.push(<Option key={item.id}>{item.name}</Option>);
            defaultValue.push(item.id.toString());
        });

        const data = [
            {time: 'Page A', uv: 4000, pv: 2400, amt: 2400},
            {time: 'Page B', uv: 3000, pv: 1398, amt: 2210},
            {time: 'Page C', uv: 2000, pv: 9800, amt: 2290},
            {time: 'Page D', uv: 2780, pv: 3908, amt: 2000},
            {time: 'Page E', uv: 1890, pv: 4800, amt: 2181},
            {time: 'Page F', uv: 2390, pv: 3800, amt: 2500},
            {time: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ]

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
                                    {getFieldDecorator('hotel', { initialValue: defaultValue })(
                                        <Select multiple>
                                            {options}
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
                <div className="ui-box">
                    <Card title="趋势">
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={this.state.partType} onChange={this.handleChange.bind(this)}>
                                    <RadioButton value={1}>人数</RadioButton>
                                    <RadioButton value={2}>次数</RadioButton>
                                </RadioGroup>
                            </div>
                            <LineChart
                                width={900}
                                height={350}
                                data={data}
                            >
                                <XAxis dataKey="time" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey={this.state.type == 1 ? 'uv' : 'uv'}
                                    name=""
                                    stroke="#8884d8"
                                />
                                <Line
                                    type="monotone"
                                    dataKey={this.state.type == 1 ? 'pv' : 'pv'}
                                    name=""
                                    stroke="#82ca9d"
                                />
                                <Line
                                    type="monotone"
                                    dataKey={this.state.type == 1 ? 'amt' : 'amt'}
                                    name=""
                                    stroke="#ff7300"
                                />
                            </LineChart>
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={this.state.buyType} onChange={this.handleChange.bind(this)}>
                                    <RadioButton value={1}>人数</RadioButton>
                                    <RadioButton value={2}>次数</RadioButton>
                                </RadioGroup>
                            </div>

                        </div>
                        <div className="ui-box">

                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

activityChart = Form.create()(activityChart);

export default activityChart;
