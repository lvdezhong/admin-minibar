import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Row, Col, Input, Select, Button, DatePicker, Table, message } from 'antd'

import action from '../../../store/actions'

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class LogList extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 1
        }
        this.paginationCfg = {
           count: 10,
           offset: 0
        }
        this.postData = {}
    }

    componentDidMount() {
        this.props.action.getAllDevice({
            offset: 0,
            count: 1000
        });
        this.props.action.getLog(this.paginationCfg);
    }

    componentWillReceiveProps(nextProps) {
        const { errors } = nextProps.state.log;
        if (errors != null) {
            message.error(errors);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = this.props.form.getFieldsValue();
        formData.start_time = formData.end_time = '';
        if (formData.time != '') {
            formData.start_time = formData.time[0].format('YYYY-MM-DD HH:mm:ss');
            formData.end_time = formData.time[1].format('YYYY-MM-DD HH:mm:ss');
        }
        delete formData.time;

        this.paginationCfg.offset = 0;
        this.postData = Object.assign(formData, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getLog(this.postData);
    }

    render() {
        const self = this;
        const { device } = this.props.state.order;
        const { log } = this.props.state.log;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        }
        const options = _.map(device, (item) => {
            return (
                <Option key={item.id}>{`${item.hotel.name}-${item.room_number}`}</Option>
            )
        });
        options.unshift(<Option key={0} value="">全部</Option>);

        const columns = [{
            title: '操作名称',
            dataIndex: 'op_name',
            key: 'op_name'
        }, {
            title: '售货机',
            key: 'machine',
            render(text, record) {
                return (
                    `${record.machine.hotel.name}-${record.machine.room_number}`
                )
            }
        }, {
            title: '操作时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created'
        }, {
            title: '用户名',
            dataIndex: 'user.name',
            key: 'user.name'
        }, {
            title: '用户类型',
            dataIndex: 'user.role_mark',
            key: 'user.role_mark',
            render(text) {
                if (text == 0) {
                    return '普通用户';
                } else if (text == 1) {
                    return '配送员';
                } else if (text == 2) {
                    return '激活员';
                }
            }
        }, {
            title: '操作状态',
            dataIndex: 'success',
            key: 'success',
            render(text) {
                if (text == 0) {
                    return '失败';
                } else if (text == 1) {
                    return '成功';
                }
            }
        }]

        const pagination = {
            current: this.state.current,
            total: log.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getLog(self.postData);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={16}>
                            <Col sm={8}>
                                <FormItem label="操作名称" {...formItemLayout}>
                                    {getFieldDecorator('op_name', { initialValue: '' })(
                                        <Input placeholder="请输入操作名称" />
                                    )}
                                </FormItem>
                                <FormItem label="操作时间" {...formItemLayout}>
                                    {getFieldDecorator('time', { initialValue: '' })(
                                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 315 }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col sm={8}>
                                <FormItem label="操作状态" {...formItemLayout}>
                                    {getFieldDecorator('success', { initialValue: '' })(
                                        <Select size="default">
                                            <Option value="">全部</Option>
                                            <Option value="1">成功</Option>
                                            <Option value="0">失败</Option>
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
                <Table
                    columns={columns}
                    dataSource={log.log_list}
                    pagination={pagination}
                />
            </div>
        )
    }
}

LogList = Form.create()(LogList);

export default LogList;
