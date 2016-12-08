import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Button, Card, Row, Col, DatePicker, message, Radio } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment';

import action from '../../../store/actions'
import { getDayCount } from '../../../utils'

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CustomizedAxisTick extends React.Component {
    render() {
        const { x, y, stroke, payload } = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">{payload.value}</text>
            </g>
        )
    }
}

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class goodsChart extends React.Component {
    constructor() {
        super()
        this.state = {
            viewType: 0,
            payType: 0,
            amountType: 0
        }
        this.isSubmit = false;
        this.viewData = [];
        this.payData = [];
        this.amountData = [];
    }

    componentDidMount() {
        const formData = this.getFormData();

        this.props.action.getGoodsViewData({
            code: 'distribute',
            from_date: formData.start_time,
            to_date: formData.end_time,
            type: 0
        }).then(() => {
            this.setState({
                viewType: 1
            })
        });
        this.props.action.getGoodsPayData({
            code: 'distribute',
            from_date: formData.start_time,
            to_date: formData.end_time,
            type: 1
        }).then(() => {
            this.setState({
                payType: 1
            })
        });
        this.props.action.getGoodsAmountData({
            code: 'distribute',
            from_date: formData.start_time,
            to_date: formData.end_time,
            type: 2
        }).then(() => {
            this.setState({
                amountType: 1
            })
        });
    }

    componentWillUpdate(nextProps, nextState) {
        const { view, pay, amount } = nextProps.state.chart;
        let viewData = _.clone(view, true),
            payData = _.clone(pay, true),
            amountData = _.clone(amount, true);

        if (this.state.viewType != nextState.viewType || this.isSubmit == true) {
            if (nextState.viewType == 1) {
                this.viewData = _.slice(viewData, 0, 10);
            } else {
                this.viewData = viewData;
            }
        }
        if (this.state.payType != nextState.payType || this.isSubmit == true) {
            if (nextState.payType == 1) {
                this.payData = _.slice(payData, 0, 10);
            } else {
                this.payData = payData;
            }
        }
        if (this.state.amountType != nextState.amountType || this.isSubmit == true) {
            if (nextState.amountType == 1) {
                this.amountData = _.slice(amountData, 0, 10);
            } else {
                this.amountData = amountData;
            }
        }
        this.isSubmit = false;
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

        this.props.action.getGoodsViewData({
            code: 'distribute',
            from_date: formData.start_time,
            to_date: formData.end_time,
            type: 0
        }).then(() => {
            this.isSubmit = true;
            this.setState({
                viewType: 1
            })
        });
        this.props.action.getGoodsPayData({
            code: 'distribute',
            from_date: formData.start_time,
            to_date: formData.end_time,
            type: 1
        }).then(() => {
            this.isSubmit = true;
            this.setState({
                payType: 1
            })
        });
        this.props.action.getGoodsAmountData({
            code: 'distribute',
            from_date: formData.start_time,
            to_date: formData.end_time,
            type: 2
        }).then(() => {
            this.isSubmit = true;
            this.setState({
                amountType: 1
            })
        });
    }

    handleChange(key, e) {
        if (key == 'view') {
            this.setState({
                viewType: e.target.value
            });
        } else if (key == 'pay') {
            this.setState({
                payType: e.target.value
            });
        } else if (key == 'amount') {
            this.setState({
                amountType: e.target.value
            });
        }
    }

    handleClick(AddDayCount) {
        this.props.form.setFieldsValue({
            time: [moment(getDayCount(AddDayCount)), moment(new Date())]
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const defaultTime = [moment(getDayCount(-7)), moment(new Date())];
        const defaultStyle = {
            width: '900px',
            height: '350px',
            textAlign: 'center',
            paddingTop: '135px'
        }

        let viewChart = <div style={defaultStyle}>暂无数据</div>,
            payChart = <div style={defaultStyle}>暂无数据</div>,
            amountChart = <div style={defaultStyle}>暂无数据</div>;

        if (this.viewData.length != 0) {
            viewChart = <BarChart
                width={900}
                height={350}
                data={this.viewData}
            >
                <XAxis dataKey="goods" interval={0} tick={<CustomizedAxisTick />} />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend wrapperStyle={{top: '-25px'}} />
                <Bar dataKey="num" name="浏览次数" fill="#8884d8" />
            </BarChart>
        }
        if (this.payData.length != 0) {
            payChart = <BarChart
                width={900}
                height={350}
                data={this.payData}
            >
                <XAxis dataKey="goods" interval={0} tick={<CustomizedAxisTick />} />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend wrapperStyle={{top: '-25px'}} />
                <Bar dataKey="num" name="支付次数" fill="#8884d8" />
            </BarChart>
        }
        if (this.amountData.length != 0) {
            amountChart = <BarChart
                width={900}
                height={350}
                data={this.amountData}
            >
                <XAxis dataKey="goods" interval={0} tick={<CustomizedAxisTick />} />
                <YAxis />
                <CartesianGrid strokeDasharray="3" />
                <Tooltip />
                <Legend wrapperStyle={{top: '-25px'}} />
                <Bar dataKey="num" name="成交额" fill="#8884d8" />
            </BarChart>
        }

        return (
            <div>
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
                    <Card title="分布">
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={this.state.viewType} onChange={this.handleChange.bind(this, 'view')}>
                                    <RadioButton value={1}>TOP10</RadioButton>
                                    <RadioButton value={2}>TOP30</RadioButton>
                                </RadioGroup>
                            </div>
                            {viewChart}
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={this.state.payType} onChange={this.handleChange.bind(this, 'pay')}>
                                    <RadioButton value={1}>TOP10</RadioButton>
                                    <RadioButton value={2}>TOP30</RadioButton>
                                </RadioGroup>
                            </div>
                            {payChart}
                        </div>
                        <div className="ui-box">
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <RadioGroup value={this.state.amountType} onChange={this.handleChange.bind(this, 'amount')}>
                                    <RadioButton value={1}>TOP10</RadioButton>
                                    <RadioButton value={2}>TOP30</RadioButton>
                                </RadioGroup>
                            </div>
                            {amountChart}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

goodsChart = Form.create()(goodsChart);

export default goodsChart;
