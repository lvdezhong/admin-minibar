import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Select, Button, message, Row, Col, Card } from 'antd'
import PubSub from 'pubsub-js'

import action from '../../../store/actions'

import Shelves from '../../../components/Shelves'

import { UPDATE_GOODS_ITEM } from '../../../utils'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class DeviceDetail extends React.Component {
    constructor() {
        super()
    }

    handleClick(e) {
        e.preventDefault();

        let { id, machine_item_list } = this.props.state.device.currentDevice;
        const formData = this.props.form.getFieldsValue();

        if (this.changed) {
            machine_item_list = machine_item_list.map(function(item) {
                delete item.id;
                return item;
            })
        }

        for (let i = 0; i < machine_item_list.length; i++) {
            if (machine_item_list[i].isDefault == true) {
                message.error('商品未添加完全！');
                return
            }
        }

        this.props.action.updateDevice({
            id: id,
            machine_item_list: JSON.stringify(machine_item_list),
            tmpl_id: formData.tmpl_id
        }).then(function(data) {
            const { code, msg } = data.value;

            if (code == 10000) {
                message.success('保存成功！');
                browserHistory.push('/device/list');
            } else {
                message.error(msg)
            }
        });
    }

    handleChangeTmpl(value) {
        if (value != 0) {
            this.changed = true;
            this.props.action.getCurrentMainTplGoods({
                id: value
            });
        }
    }

    componentDidMount() {
        const { id } = this.props.params;

        this.props.action.getAllMainTpl({
            offset: 0,
            count: 1000
        }).then(this.props.action.getCurrentDevice({
            id: id
        }));

        this.pubsub_token = PubSub.subscribe(UPDATE_GOODS_ITEM, function(msg, data) {
            this.props.form.setFieldsValue({
                tmpl_id: '0',
            });
        }.bind(this));
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }

    render() {
        const self = this;

        const { getFieldDecorator } = this.props.form;
        const { currentDevice, maintpl } = this.props.state.device;

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }

        let options = maintpl.map((item) => {
            return (
                <Option key={item.id}>{item.name}</Option>
            )
        });

        options.unshift(<Option key="0">自定义模版</Option>);

        const defaultValue = currentDevice.tmpl_id ? currentDevice.tmpl_id.toString() : '0';

        const select = <FormItem>
            {getFieldDecorator('tmpl_id', { initialValue: defaultValue })(
                <Select size="small" style={{ width: 100 }} onChange={self.handleChangeTmpl.bind(this)}>
                    {options}
                </Select>
            )}
        </FormItem>

        return (
            <div>
                <Card title="设备信息" style={{ marginBottom: 15 }}>
                    <Row>
                        <Col span={12}>
                            <Form className="device-form" horizontal>
                                <FormItem {...formItemLayout} label="设备编号">
                                    <p className="ant-form-text">{currentDevice.machine_sn}</p>
                                </FormItem>
                                <FormItem {...formItemLayout} label="酒店名称">
                                    <p className="ant-form-text">{currentDevice.hotel && currentDevice.hotel.name}</p>
                                </FormItem>
                                <FormItem {...formItemLayout} label="房间号">
                                    <p className="ant-form-text">{currentDevice.room_number}</p>
                                </FormItem>
                                <FormItem {...formItemLayout} label="详细地址">
                                    <p className="ant-form-text">{currentDevice.hotel && currentDevice.hotel.address}</p>
                                </FormItem>
                                <FormItem {...formItemLayout} label="设备主页">
                                    <img src={`http://tms.taojae.com/qrcode/img?c=${currentDevice.qr_code}`} />
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </Card>
                <Card title="设备商品" extra={select}>
                    <Shelves keyword="device" />
                    <div className="footer-btn">
                        <Button type="primary" size="large" onClick={this.handleClick.bind(this)}>保存</Button>
                    </div>
                </Card>
            </div>
        )
    }
}

DeviceDetail = Form.create()(DeviceDetail)

export default DeviceDetail;
