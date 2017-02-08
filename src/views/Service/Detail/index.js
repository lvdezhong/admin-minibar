import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button, Upload, Icon, message, Row, Col, DatePicker, TimePicker, Select, InputNumber } from 'antd'
import moment from 'moment'

import action from '../../../store/actions'

import './index.less'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class serviceDetail extends React.Component {
    constructor(props) {
        super()
        this.state = {};
        this.hotel_id = props.state.hotel.currentHotel;
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        if (this.isEdit) {
            this.props.action.getCurrentService({
                id: this.id
            });
        } else {
            this.props.action.getNewService();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { service } = nextProps.state;
        const errors = this.props.state.service.errors;
        const nextErrors = nextProps.state.service.errors;

        if (nextProps.state.service.currentService != this.props.state.service.currentService) {
            this.setState({
                serviceImg: service.currentService.service_image_url
            });
        }
        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleChange(info) {
        let file = info.file;

        if (file.status === 'done') {
            message.success(`${file.name} 上传成功！`);
        } else if (file.status === 'error') {
            message.error(`${file.name} 上传失败！`);
        }

        if (file.response && file.response.code == 10000) {
            file.url = file.response.data.url;

            this.setState({
                serviceImg: file.url
            });

            this.props.form.setFieldsValue({
                service_image_url: file.url
            });
        }
    }

    handleStartUpload() {
        message.warning('上传中...');
    }

    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    disabledMinutes() {
        const minutes = this.range(0, 60);
        minutes.splice(0, 1);
        minutes.splice(29, 1);
        return minutes;
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            if (values.service_start._d >= values.service_end._d) {
                message.error('服务开始时间不能大于结束时间');
                return;
            }

            values.shelf_start = values.time[0].format('YYYY-MM-DD');
            values.shelf_end = values.time[1].format('YYYY-MM-DD');
            delete values.time;

            values.service_start = values.service_start.format('HH:mm:ss');
            values.service_end = values.service_end.format('HH:mm:ss');

            values.advanced_time = (values.advanced_time * 60).toFixed(0);

            if (this.isEdit) {
                values.id = this.id;
                values.hotel_id = this.hotel_id;
                this.props.action.updateService(values).then(() => {
                    message.success('修改成功');
                    browserHistory.push('/service/list');
                }).catch(data => {
                    message.error(data.msg);
                });
            } else {
                values.hotel_id = this.hotel_id;
                this.props.action.addService(values).then(() => {
                    message.success('添加成功');
                    browserHistory.push('/service/list');
                }).catch(data => {
                    message.error(data.msg);
                });
            }
        });
    }

    render() {
        const { currentService } = this.props.state.service;
        const { serviceImg } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        const { getFieldDecorator } = this.props.form;

        const props_upload = {
            action: 'http://media.mockuai.com/upload.php',
            data: {
                user_id: 2088575
            },
            headers:{
                "X-Requested-With": null
            },
            accept: ".jpg,.png",
            showUploadList: false,
            onChange: this.handleChange.bind(this),
            beforeUpload: this.handleStartUpload.bind(this)
        }

        const format = 'HH:mm';

        let defaultTime = [];
        if (currentService.shelf_start && currentService.shelf_end) {
            defaultTime = [moment(currentService.shelf_start), moment(currentService.shelf_end)];
        }

        let defaultServiceStart = moment('00:00', 'HH:mm'),
            defaultServiceEnd = moment('00:30', 'HH:mm');
        if (currentService.service_start && currentService.service_end) {
            defaultServiceStart = moment(currentService.service_start, 'YYYY-MM-DD HH:mm');
            defaultServiceEnd = moment(currentService.service_end, 'YYYY-MM-DD HH:mm');
        }

        return (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem {...formItemLayout} label="服务名称">
                    {getFieldDecorator('title', {
                        initialValue: currentService.title,
                        rules: [
                            { required: true, message: '服务名称不能为空' }
                        ]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="服务图标">
                    {getFieldDecorator('service_image_url', {
                        initialValue: currentService.service_image_url,
                        rules: [
                            { required: true, message: '服务图标不能为空' }
                        ]
                    })(
                        <Input style={{display: 'none'}}/>
                    )}
                    <Upload className="serviceimg-uploader" {...props_upload}>
                        {
                            serviceImg ?
                            <img src={serviceImg} className="serviceimg" /> :
                            <Icon type="plus" className="serviceimg-uploader-trigger" />
                        }
                    </Upload>
                </FormItem>
                <FormItem {...formItemLayout} label="上架时间">
                    {getFieldDecorator('time', {
                        initialValue: defaultTime,
                        rules: [
                            { required: true, type: 'array', message: '上架时间不能为空' }
                        ]
                    })(
                        <RangePicker />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="服务时段">
                    <Col span="4">
                        <FormItem>
                            {getFieldDecorator('service_start', {
                                initialValue: defaultServiceStart,
                                rules: [
                                    { required: true, type: 'object', message: '开始时间不能为空' }
                                ]
                            })(
                                <TimePicker
                                    format={format}
                                    disabledMinutes={this.disabledMinutes.bind(this)}
                                    hideDisabledOptions
                                    placeholder="开始时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem>
                            {getFieldDecorator('service_end', {
                                initialValue: defaultServiceEnd,
                                rules: [
                                    { required: true, type: 'object', message: '结束时间不能为空' }
                                ]
                            })(
                                <TimePicker
                                    format={format}
                                    disabledMinutes={this.disabledMinutes.bind(this)}
                                    hideDisabledOptions
                                    placeholder="结束时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>
                <FormItem {...formItemLayout} label="服务时长">
                    {getFieldDecorator('duration', {
                        initialValue: currentService.duration ? currentService.duration.toString() : '0',
                        rules: [
                            { required: true, message: '服务时长不能为空' }
                        ]
                    })(
                        <Select style={{ width: 200 }}>
                            <Option key='0'>客房自助，无服务时长</Option>
                            <Option key='30'>30分钟</Option>
                            <Option key='60'>1小时</Option>
                            <Option key='90'>1.5小时</Option>
                            <Option key='120'>2小时</Option>
                            <Option key='180'>2.5小时</Option>
                            <Option key='240'>3小时</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="服务人数">
                    {getFieldDecorator('count', {
                        initialValue: currentService.count ? currentService.count.toString() : '',
                        rules: [
                            { required: true, message: '服务人数不能为空' }
                        ]
                    })(
                        <Input placeholder="请设置同一时间最多可服务人数" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="提前预约">
                    <span className="ant-form-text">房客需提前</span>
                    {getFieldDecorator('advanced_time', {
                        initialValue: currentService.advanced_time ? Number((currentService.advanced_time / 60).toFixed(0)) : '',
                        rules: [
                            { required: true, type: 'number', message: '提前预约时间不能为空' }
                        ]
                    })(
                        <InputNumber min={0} />
                    )}
                    <span className="ant-form-text">小时预约该服务</span>
                </FormItem>
                <FormItem {...formItemLayout} label="携带人数" extra="最多可设置为5人">
                    {getFieldDecorator('single_count', {
                        initialValue: currentService.single_count ? currentService.single_count.toString() : '',
                        rules: [
                            { required: true, message: '携带人数不能为空' }
                        ]
                    })(
                        <Input placeholder="请设置一个预约人最多可携带人数" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="服务说明">
                    {getFieldDecorator('content', {
                        initialValue: currentService.content,
                        rules: [
                            { required: true, message: '服务说明不能为空' }
                        ]
                    })(
                        <Input type="textarea" rows={4} placeholder="请输入该服务的说明，如是否收费，如服务地点说明等。" />
                    )}
                </FormItem>
                <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                    <Button type="primary" htmlType="submit" size="default">确定</Button>
                </FormItem>
            </Form>
        )
    }
}

serviceDetail = Form.create()(serviceDetail)

export default serviceDetail;
