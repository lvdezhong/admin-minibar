import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Select, Card, Row, Col, DatePicker, message, Radio } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment'

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
            type: 1
        }
    }

    componentDidMount() {
        this.id = this.props.params.id;

        this.props.action.getHotel({
            offset: 0,
            count: 1000
        });

        this.getFormData(data => {
            this.props.action.getActivityPartData({
                code: 'task_tendency',
                from_date: data.start_time,
                to_date: data.end_time,
                hotel_id_list: JSON.stringify(data.hotel),
                task_id: this.id
            });

            this.props.action.getActivityLiveData({
                code: 'task_hour',
                from_date: data.start_time,
                to_date: data.end_time,
                hotel_id_list: JSON.stringify(data.hotel),
                task_id: this.id
            });

            this.props.action.getActivityRatioData({
                code: 'task_ratio',
                from_date: data.start_time,
                to_date: data.end_time,
                hotel_id_list: JSON.stringify(data.hotel),
                task_id: this.id
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.chart.errors;
        const nextErrors = nextProps.state.chart.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.getFormData(data => {
            this.props.action.getActivityPartData({
                code: 'task_tendency',
                from_date: data.start_time,
                to_date: data.end_time,
                hotel_id_list: JSON.stringify(data.hotel),
                task_id: this.id
            });

            this.props.action.getActivityLiveData({
                code: 'task_hour',
                from_date: data.start_time,
                to_date: data.end_time,
                hotel_id_list: JSON.stringify(data.hotel),
                task_id: this.id
            });

            this.props.action.getActivityRatioData({
                code: 'task_ratio',
                from_date: data.start_time,
                to_date: data.end_time,
                hotel_id_list: JSON.stringify(data.hotel),
                task_id: this.id
            });
        });
    }

    handleChange(e) {
        this.setState({
            type: e.target.value
        })
    }

    handleClick(AddDayCount) {
        this.props.form.setFieldsValue({
            time: [moment(getDayCount(AddDayCount)), moment(new Date())]
        });
    }

    getFormData(cb) {
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写筛选条件');
                return;
            }

            values.start_time = values.end_time = '';

            if (values.time != '') {
                values.start_time = values.time[0].format('YYYY-MM-DD');
                values.end_time = values.time[1].format('YYYY-MM-DD');
            }
            delete values.time;

            if (_.indexOf(values.hotel, '0') != -1) {
                values.hotel = ['0'];
            }

            cb && cb(values)
        });
    }

    render() {
        const { hotel, activityPart, activityLive, activityRatio } = this.props.state.chart;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };
        const defaultTime = [moment(getDayCount(-7)), moment(new Date())];
        const options = [<Option key={0}>全部</Option>];

        _.each(hotel, (item) => {
            options.push(<Option key={item.id}>{item.name}</Option>);
        });

        const defaultStyle = {
            width: '900px',
            height: '350px',
            textAlign: 'center',
            paddingTop: '135px'
        }

        let activityChart1 = <div style={defaultStyle}>暂无数据</div>,
            activityChart2 = <div style={defaultStyle}>暂无数据</div>,
            activityChart3 = <div style={defaultStyle}>暂无数据</div>;

        if (activityPart.data) {
            activityChart1 = <LineChart
                width={900}
                height={350}
                data={activityPart.data}
            >
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend />
                {
                    _.map(activityPart.hotel, (item, index) => {
                        return (
                            <Line
                                type="monotone"
                                key={index}
                                name={item.name}
                                stroke={item.color}
                                dataKey={this.state.type == 1 ? `hotel_${index}_people` : `hotel_${index}_num`}
                            />
                        )
                    })
                }
            </LineChart>
        }
        if (activityLive.data) {
            activityChart2 = <LineChart
                width={900}
                height={350}
                data={activityLive.data}
            >
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend />
                {
                    _.map(activityLive.hotel, (item, index) => {
                        return (
                            <Line
                                type="monotone"
                                key={index}
                                name={item.name}
                                stroke={item.color}
                                dataKey={`hotel_${index}_num`}
                            />
                        )
                    })
                }
            </LineChart>
        }
        if (activityRatio.data) {
            activityChart3 = <LineChart
                width={900}
                height={350}
                data={activityRatio.data}
            >
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend />
                {
                    _.map(activityRatio.hotel, (item, index) => {
                        return (
                            <Line
                                type="monotone"
                                key={index}
                                name={item.name}
                                stroke={item.color}
                                dataKey={`hotel_${index}_num`}
                            />
                        )
                    })
                }
            </LineChart>
        }

        return (
            <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={40}>
                            <Col span={12}>
                                <FormItem label="操作时间" {...formItemLayout} style={{ marginBottom: '0' }}>
                                    {getFieldDecorator('time', {
                                        initialValue: defaultTime,
                                        rules: [
                                            { required: true, type: 'array', message: '操作时间不能为空' }
                                        ]
                                    })(
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
                                <FormItem label="酒店" {...formItemLayout}>
                                    {getFieldDecorator('hotel', {
                                        initialValue: ['0'],
                                        rules: [
                                            { required: true, type: 'array', message: '酒店不能为空' }
                                        ]
                                    })(
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
                                <RadioGroup value={this.state.type} onChange={this.handleChange.bind(this)}>
                                    <RadioButton value={1}>人数</RadioButton>
                                    <RadioButton value={2}>次数</RadioButton>
                                </RadioGroup>
                            </div>
                            <p style={{textAlign: 'center', fontSize: '14px', marginBottom: '15px'}}>活动参与人数，次数日变化折现图</p>
                            {activityChart1}
                        </div>
                        <div className="ui-box">
                            <p style={{textAlign: 'center', fontSize: '14px', marginBottom: '15px'}}>全天活跃度变化曲线图</p>
                            {activityChart2}
                        </div>
                        <div className="ui-box">
                            <p style={{textAlign: 'center', fontSize: '14px', marginBottom: '15px'}}>参与人数与首页UV比率日变化折线图</p>
                            {activityChart3}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

activityChart = Form.create()(activityChart);

export default activityChart;
