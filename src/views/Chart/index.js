import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Form, Row, Col, Input, Select, Button, Radio, Table, Tag, Pagination, DatePicker, message } from 'antd'
var LineChart = require('../../components/lineChart');
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import action from '../../store/actions'

import { price } from '../../utils'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Chart extends React.Component {
    constructor() {
        super()

        this.timeData = {
            start_time: '',
            end_time: ''
        }
        this.hotelData = {
            hotel_id_list: ''
        }
        this.postData = {
            task_id: ''
        }
        this.state={
            value:'1'
        }
        this.chartOne = []
        this.chartTwo = []
        this.chartThree = []
        this.LineChartOne = 'peopleLine'
    }

    //时间选择
    handleTimeChange(dates, dateStrings) {
        this.timeData.start_time = dateStrings[0] + ' 00:00:00';
        this.timeData.end_time = dateStrings[1] + ' 00:00:00';
        this.postData = Object.assign(this.postData, this.timeData);
    }

    //酒店列表
    handleChangeSelect(value) {
        var arrVal = [];
        value.forEach(function (v, i) {
            arrVal.push(v * 1);
        });
        this.hotelData.hotel_id_list = JSON.stringify(arrVal);
        this.postData = Object.assign(this.postData, this.hotelData);
    }

    //图形切换
    onChangeLineType(e) {
        this.setState({
            value: e.target.value
        });
        if (e.target.value == 1) {
            this.LineChartOne = 'peopleLine';
        } else {
            this.LineChartOne = 'countLine';
        }
    }

    //处理数据
    handleLine(_obj) {
        var lineData = [];
        var lineObj = {
            name: '',
            values: [],
            strokeWidth: 3
        }
        var obj = {
            x: null,
            y: null
        }
        var arr = [];
        _obj.data.forEach(function (item, index) {
            lineObj = {
                name: '',
                values: [],
                strokeWidth: null
            }
            arr = [];
            if (_obj.type == 'hourCount') {
                item.point.forEach(function (v, i) {
                    obj = {
                        x: null,
                        y: null
                    }
                    obj.x = v * 1;
                    obj.y = item.hourCount[i];
                    arr.push(obj);
                    lineObj.values = arr;
                });
            } else {
                item.date.forEach(function (v, i) {
                    obj = {
                        x: null,
                        y: null
                    }
                    obj.x = v * 1;
                    switch (_obj.type) {
                        case 'peopleLine':
                            obj.y = item.people[i];
                            break;
                        case 'countLine':
                            obj.y = item.count[i];
                            break;
                        case 'buyLine':
                            obj.y = item.buy[i];
                            break;
                        case 'ratioLine':
                            obj.y = item.ratio[i];
                            break;
                    }
                    arr.push(obj);
                    lineObj.values = arr;
                });
            }
            lineObj.name = item.name;
            lineData.push(lineObj);
        });
        return lineData;
    }

    //筛选按钮
    handleSubmit(e) {
        e.preventDefault();
        this.handleChangeSelect(this.props.form.getFieldsValue().hotel_id_list);
        this.postData = Object.assign(this.postData, this.timeData);
        this.props.action.getChart(this.postData).catch((data) => {
            message.error(data.msg);
        })
    }

    componentDidMount() {
        var arrHotelList = [];
        this.postData.task_id = this.props.params.id;
        this.props.action.getHotel({
            offset: 0,
            count: 1000
        }).then((data)=> {
            data.value.data.hotel_list.forEach(function (val, index) {
                arrHotelList.push(val.id * 1);
            });
            this.props.action.getChart({
                start_time: '2016-11-02 00:00:00',
                end_time: '2016-11-18 00:00:00',
                hotel_id_list: JSON.stringify(arrHotelList),
                task_id: this.postData.task_id
            }).catch((data) => {
                message.error(data.msg);
            });
        });
    }

    //不可选择今天之后
    newArray(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    disabledDate = function (current) {
        return current && current.valueOf() > Date.now();
    };

    disabledTime(time, type) {
        var that = this;
        if (type === 'start') {
            return {
                disabledHours() {
                    return that.newArray(0, 60).splice(4, 20);
                },
                disabledMinutes() {
                    return that.newArray(30, 60);
                },
                disabledSeconds() {
                    return [55, 56];
                },
            };
        }
        return {
            disabledHours() {
                return that.newArray(0, 60).splice(20, 4);
            },
            disabledMinutes() {
                return that.newArray(0, 31);
            },
            disabledSeconds() {
                return [55, 56];
            },
        };
    }

    render() {
        const {chart, hotel } = this.props.state.chart;
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        }
        const { getFieldDecorator } = this.props.form
        //hotel列表
        var hotelList = hotel.hotel_list || [];
        let options = hotelList.map((item) => {
            return (
                <Option key={item.id} value={item.id.toString()}>{`${item.name}`}</Option>
            )
        });
        let hotelId = [];
        hotelList.forEach(function (val, index) {
            hotelId.push(val.id.toString());
        });

        if (chart.hotel) {
            this.chartOne = this.handleLine({
                data: chart.hotel,
                type: this.LineChartOne
            });
            this.chartTwo = this.handleLine({
                data: chart.hotel,
                type: 'buyLine'
            });
            this.chartThree = this.handleLine({
                data: chart.hotel,
                type: 'hourCount'
            });
        }

        if (chart.hotel && chart.hotel.length == 0) {
            var elem = <div>暂无活动数据</div>
        } else {
            var elem = <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={25}>
                            <Col sm={8}>
                                <FormItem label="活动时间" {...formItemLayout}>
                                    <RangePicker style={{ width: 200 }} disabledDate={this.disabledDate}
                                                 disabledTime={this.disabledTime}
                                                 onChange={this.handleTimeChange.bind(this)}/>
                                </FormItem>
                            </Col>
                            <Col sm={12}>
                                <FormItem label="酒店名称" labelCol={{ span: 6 }}>
                                    {getFieldDecorator('hotel_id_list', {initialValue: hotelId})(
                                        <Select style={{width:'75%'}} multiple
                                                onChange={this.handleChangeSelect.bind(this)}>
                                            {options}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col sm={2} sm={2} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">筛选</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className="ui-box">
                    <RadioGroup className="radio_type" onChange={this.onChangeLineType.bind(this)} defaultValue="1" value={this.state.value}>
                        <RadioButton value="1">人数</RadioButton>
                        <RadioButton value="2">次数</RadioButton>
                    </RadioGroup>
                    <LineChart
                        legend={true}
                        data={this.chartOne}
                        width={800}
                        height={400}
                        viewBoxObject={{
                                x: 0,
                                y: 0,
                                width: 800,
                                height: 400
                            }}
                        title="酒店维度，活动参与人数，次数日变化折线图"
                        yAxisLabel="活动参与数"
                        xAxisLabel="日期"
                        xAccessor={(d)=> {
                            return new Date(d.x);
                            }
                        }
                        tickStroke={'#666'}
                        gridHorizontal={true}
                        gridVertical={true}
                        gridHorizontalStroke={'#000'}
                        gridVerticalStrokeDash={'1, 0'}
                    />
                </div>
                <div className="ui-box">
                    <LineChart
                        legend={true}
                        data={this.chartTwo}
                        width={800}
                        height={400}
                        viewBoxObject={{
                                x: 0,
                                y: 0,
                                width: 700,
                                height: 400
                            }}
                        title="酒店维度，购买人数与活动参与人数比率日变化折线图"
                        yAxisLabel="活动参与比率"
                        xAxisLabel="日期"
                        xAccessor={(d)=> {
                                return new Date(d.x);
                                }
                            }
                        yAccessor={(d)=>d.y}
                        tickStroke={'#666'}
                        gridHorizontal={true}
                        gridVertical={true}
                        gridHorizontalStroke={'#000'}
                        gridVerticalStrokeDash={'1, 0'}
                    />
                </div>
                <div className="ui-box">
                    <LineChart
                        legend={true}
                        data={this.chartThree}
                        width={800}
                        height={400}
                        viewBoxObject={{
                                x: 0,
                                y: 0,
                                width: 700,
                                height: 400
                            }}
                        title="酒店维度，全天活跃度变化曲线图"
                        yAxisLabel="活动参与人数"
                        xAxisLabel="小时"
                        tickStroke={'#666'}
                        gridHorizontal={true}
                        gridVertical={true}
                        gridHorizontalStroke={'#000'}
                        gridVerticalStrokeDash={'1, 0'}
                    />
                </div>
            </div>
        }

        return (
            <div>
                {elem}
            </div>
        )
    }
}

Chart = Form.create()(Chart);

export default Chart;
