import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Form, Row, Col, Input, Select, Table, Tag, Button } from 'antd'

import action from '../../../store/actions'

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class DeviceList extends React.Component {
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

    handleSubmit(e) {
        e.preventDefault();

        const formData = this.props.form.getFieldsValue();

        this.paginationCfg.offset = 0;
        this.postData = Object.assign(formData, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getDevice(this.postData);
    }

    componentDidMount() {
        this.props.action.getDevice(this.paginationCfg);
        this.props.action.getAllMainTpl({
            offset: 0,
            count: 1000
        });
    }

    render() {
        const self = this;

        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }

        const stock_status = {
            0: "全部售罄",
            1: "严重缺货",
            2: "库存紧张",
            3: "库存充足"
        }

        const status = {
            0: "离线",
            1: "在线",
            2: "故障"
        }

        const { device, maintpl } = this.props.state.device;

        const columns = [{
            title: '设备编号',
            dataIndex: 'machine_sn',
            key: 'machine_sn'
        }, {
            title: '酒店',
            dataIndex: 'hotel.name',
            key: 'hotel.name'
        }, {
            title: '房间号',
            dataIndex: 'room_number',
            key: 'room_number'
        }, {
            title: '模版',
            dataIndex: 'machine_tmpl.name',
            key: 'machine_tmpl.name'
        }, {
            title: '地址',
            dataIndex: 'hotel.address',
            key: 'hotel.address'
        }, {
            title: '运行状态',
            dataIndex: 'status',
            key: 'status',
            render(text) {
                return status[text]
            }
        }, {
            title: '库存',
            dataIndex: 'stock_status',
            key: 'stock_status',
            render(text) {
                return stock_status[text]
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            render(text) {
                return <Link to={`/device/detail/${text}`}>查看详情</Link>
            }
        }]

        const pagination = {
            current: this.state.current,
            total: device.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getDevice(self.postData);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        let options = maintpl.map((item) => {
            return (
                <Option key={item.id} value={item.id.toString()}>{item.name}</Option>
            )
        });

        options.unshift(<Option key="" value="">全部</Option>, <Option key="0" value="0">自定义模版</Option>);

        const { getFieldDecorator } = this.props.form

        return (
            <div>
                <div className="ui-box">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label="设备编号" {...formItemLayout}>
                                    {getFieldDecorator('machine_sn', { initialValue: '' })(
                                        <Input placeholder="请输入设备编号" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="模版" {...formItemLayout}>
                                    {getFieldDecorator('tmpl_id', { initialValue: '' })(
                                        <Select size="default">
                                            {options}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="库存" {...formItemLayout}>
                                    {getFieldDecorator('stock_status', { initialValue: '' })(
                                        <Select size="default">
                                            <Option value="">全部</Option>
                                            <Option value="3">库存充足</Option>
                                            <Option value="2">库存紧张</Option>
                                            <Option value="1">严重缺货</Option>
                                            <Option value="0">全部售罄</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="酒店名称" {...formItemLayout}>
                                    {getFieldDecorator('hotel_name', { initialValue: '' })(
                                        <Input placeholder="请输入酒店名称" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="运行状态" {...formItemLayout}>
                                    {getFieldDecorator('status', { initialValue: '' })(
                                        <Select size="default">
                                            <Option value="">全部</Option>
                                            <Option value="1">在线</Option>
                                            <Option value="0">离线</Option>
                                            <Option value="2">故障</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">筛选</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Table columns={columns} dataSource={device.machine_list} pagination={pagination} />
            </div>
        )
    }
}

DeviceList = Form.create()(DeviceList);

export default DeviceList;
