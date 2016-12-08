import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Card, Row, Col, DatePicker, message, Radio, Icon } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment';

import action from '../../../store/actions'
import { price, getDayCount } from '../../../utils'

import './index.less'

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
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
        this.state = {
            type: 1
        }
    }

    componentDidMount() {
        const formData = this.getFormData();

        this.props.action.getGlobalData({
            code: 'general'
        });
        this.props.action.getStatisData({
            code: 'statistics',
            from_date: formData.start_time,
            to_date: formData.end_time
        });
        this.props.action.getTrendData({
            code: 'tendency',
            from_date: formData.start_time,
            to_date: formData.end_time
        });
    }

    componentWillReceiveProps(nextProps) {
        const { errors } = nextProps.state.chart;
        if (errors != null) {
            message.error(errors);
        }
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

    handleSubmit(e) {
        e.preventDefault();

        const formData = this.getFormData();

        this.props.action.getStatisData({
            code: 'statistics',
            from_date: formData.start_time,
            to_date: formData.end_time
        });
        this.props.action.getTrendData({
            code: 'tendency',
            from_date: formData.start_time,
            to_date: formData.end_time
        });
    }

    handleClick(AddDayCount) {
        this.props.form.setFieldsValue({
            time: [moment(getDayCount(AddDayCount)), moment(new Date())]
        });
    }

    handleChange(e) {
        this.setState({
            type: e.target.value
        })
    }

    render() {
        const { global, statis, trend } = this.props.state.chart;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const defaultTime = [moment(getDayCount(-7)), moment(new Date())];

        let card = _.map(global, (item, index) => {
            if (index == 0) {
                item.color = '#f28c86';
                item.text = '累计交易额/订单量';
            } else if (index == 1) {
                item.color = '#91959c';
                item.text = '近30天交易额/订单量';
            } else if (index == 2) {
                item.color = '#93c5e9';
                item.text = '近7天交易额/订单量';
            } else if (index == 3) {
                item.color = '#90dfb4';
                item.text = '今日交易额/订单量';
            }

            return (
                <Col span={6} key={index}>
                    <div className="data-card" style={{background: item.color}}>
                        <div className="card-icon">
                            <Icon type="pay-circle" />
                        </div>
                        <div className="card-info">
                            <span className="card-info-num">{price('GET', item.trade)} / {item.order}</span>
                            <span className="card-info-text"><font>{item.text}</font></span>
                        </div>
                    </div>
                </Col>
            )
        })

        const defaultStyle = {
            width: '900px',
            height: '350px',
            textAlign: 'center',
            paddingTop: '135px'
        }

        let trendChart1 = <div style={defaultStyle}>暂无数据</div>,
            trendChart2 = <div style={defaultStyle}>暂无数据</div>;

        if (trend.length != 0) {
            trendChart1 = <LineChart
                width={900}
                height={350}
                data={trend}
            >
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={this.state.type == 1 ? 'home' : 'detailPercent'}
                    name={this.state.type == 1 ? '首页浏览人数' : '详情页转化率'}
                    stroke="#8884d8"
                />
                <Line
                    type="monotone"
                    dataKey={this.state.type == 1 ? 'detail' : 'payPercent'}
                    name={this.state.type == 1 ? '详情页浏览人数' : '付款转化率'}
                    stroke="#82ca9d"
                />
                <Line
                    type="monotone"
                    dataKey={this.state.type == 1 ? 'pay' : 'globalPercent'}
                    name={this.state.type == 1 ? '付款人数' : '全场转化率'}
                    stroke="#ff7300"
                />
            </LineChart>;

            trendChart2 = <LineChart
                width={900}
                height={350}
                data={trend}
            >
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" name="客单价" stroke="#8884d8" />
            </LineChart>;
        }

        return (
            <div>
                <div className="ui-box">
                    <Card title="概况">
                        <Row gutter={10}>
                            {card}
                        </Row>
                    </Card>
                </div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={40}>
                            <Col span={16}>
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
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">筛选</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="ui-box">
                    <Card title="统计">
                        <div className="statistics-wrapper">
                            <div className="data-map">
                                <div className="map-part1">
                                    <div className="map-block">
                                        <span className="map-block-title">
                                            <Icon type="home" /> 首页浏览人数
                                        </span>
                                        <span className="map-block-num">{statis[0]}</span>
                                    </div>
                                    <div className="map-block">
                                        <span className="map-block-title">
                                            <Icon type="menu-unfold" /> 详情浏览人数
                                        </span>
                                        <span className="map-block-num">{statis[1]}</span>
                                    </div>
                                    <div className="map-block">
                                        <span className="map-block-title">
                                            <Icon type="pay-circle-o" /> 付款人数
                                        </span>
                                        <span className="map-block-num">{statis[2]}</span>
                                    </div>
                                </div>
                                <div className="map-part2">
                                    <span className="num1">转化率：{statis[3]}%</span>
                                    <span className="num2">转化率：{statis[4]}%</span>
                                    <span className="num3">转化率：{statis[5]}%</span>
                                </div>
                            </div>
                            <div className="data-poster">
                                <span className="poster-title">
                                    <Icon type="pay-circle-o" /> 客单价
                                </span>
                                <span className="poster-num">{price('GET', statis[6])}</span>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="ui-box">
                    <Card title="趋势">
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={this.state.type} onChange={this.handleChange.bind(this)}>
                                    <RadioButton value={1}>浏览人数</RadioButton>
                                    <RadioButton value={2}>转化率</RadioButton>
                                </RadioGroup>
                            </div>
                            {trendChart1}
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={1}>
                                    <RadioButton value={1}>客单价</RadioButton>
                                </RadioGroup>
                            </div>
                            {trendChart2}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

tradeChart = Form.create()(tradeChart);

export default tradeChart;
