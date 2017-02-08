import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table, Form, Row, Col, Input, Button, Modal, message } from 'antd'

import action from '../../../store/actions'

import SearchInput from '../../../components/SearchInput'

import './index.less'

const FormItem = Form.Item;

const RoomList = props => {
    const handleClick = index => {
        props.onRemove(index);
    }

    let roomItem = _.map(props.dataSource, (item, index) => {
        return (
            <li key={item.id}>
                <Row>
                    <Col span={12}>{item.number}</Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Button type="primary" size="small" onClick={handleClick.bind(this, index)}>删除</Button>
                    </Col>
                </Row>
            </li>
        )
    });

    return (
        <ul>
            {roomItem}
        </ul>
    )
}

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class WifiDetail extends React.Component {
    constructor(props) {
        super()
        this.state = {
            visible: false,
            current: 1,
            selectedArr: []
        }

        this.paginationCfg = {
           count: 10,
           offset: 0
        }

        this.hotel_id = props.state.hotel.currentHotel;
        this.postData = {
            hotel_id: this.hotel_id
        }
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        if (this.isEdit) {
            this.props.action.getWifi({
                count: 1000,
                offset: 0
            }).then(() => {
                const wifiList = this.props.state.wifi.wifi.wifi_config_list;
                const data = this.getItem(wifiList, this.id);

                this.props.action.getCurrentWifi(data);

                this.setState({
                    selectedArr: _.clone(data.room_list, true)
                });
            });
        } else {
            this.props.action.getNewWifi();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        var roomList = nextProps.state.wifi.room.room_list;
        const { selectedArr } = nextState;

        _.forEach(roomList, (item) => {
            const _index = this.getIndex(selectedArr, item.id);

            if (_index == -1) {
                item.selected = false;
            } else {
                item.selected = true;
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.wifi.errors;
        const nextErrors = nextProps.state.wifi.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    getIndex(arr, id) {
        let index = -1;

        if (arr.length == 0) {
            return index;
        }

        _.forEach(arr, (item, i) => {
            if (item.id == id) {
                return index = i;
            }
        })

        return index;
    }

    getItem(arr, id) {
        let obj = {}

        _.forEach(arr, item => {
            if (item.id == id) {
                return obj = item;
            }
        })

        return obj;
    }

    showModal() {
        this.setState({
            visible: true
        });

        this.postData = Object.assign(this.postData, this.paginationCfg);
        this.props.action.getRoom(this.postData);
    }

    handleCancel() {
        this.setState({
            visible: false
        });
    }

    handleOk() {
        const { selectedArr } = this.state;
        const _selectedArr = _.clone(selectedArr, true)

        if (selectedArr.length == 0) {
             message.warning('请选择一个房间！');
             return;
        }

        this.props.action.updateRoomList(_selectedArr, 'room_list');

        this.setState({
            visible: false
        });
    }

    handleSearch(value) {
        this.paginationCfg.offset = 0;
        this.postData = Object.assign(this.postData, {
            keywords: value
        }, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getRoom(this.postData);
    }

    roomItemClick(item) {
        const { selectedArr } = this.state;
        const _index = this.getIndex(selectedArr, item.id);

        if (_index == -1) {
            selectedArr.push(item);
        } else {
            selectedArr.splice(_index, 1);
        }

        this.setState({
            selectedArr: selectedArr
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            const { room_list } = this.props.state.wifi.currentWifi;

            if (room_list == undefined || room_list.length == 0) {
                message.error('请正至少选择一个房间！');
                return;
            }

            let machine_id_list = _.map(room_list, function(item) {
                return item.machine_id;
            });

            let postData = {
                hotel_id: this.hotel_id,
                wifi_name: values.account,
                wifi_pwd: values.password,
                machine_id_list: JSON.stringify(machine_id_list)
            }
            if (this.isEdit) {
                postData.id = this.id;
            }

            this.props.action.addWifi(postData).then(() => {
                browserHistory.push('/wifi/list');
            });
        });
    }

    handleRemove(index) {
        const { selectedArr } = this.state;
        selectedArr.splice(index, 1);
        const _selectedArr = _.clone(selectedArr, true)

        this.props.action.updateRoomList(_selectedArr, 'room_list');
    }

    render() {
        const self = this;

        const { currentWifi, room } = this.props.state.wifi;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        const { getFieldDecorator } = this.props.form;

        const columns = [{
            title: '酒店房间号',
            dataIndex: 'number',
            key: 'number',
            width: '90%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '10%',
            render(text, record) {
                let elem;
                if (record.status == 0) {
                    elem = <Button size="small" disabled>已添加</Button>
                } else {
                    if (record.selected) {
                        elem = <Button type="primary" size="small" onClick={() => self.roomItemClick(record)}>已选择</Button>
                    } else {
                        elem = <Button type="default" size="small" onClick={() => self.roomItemClick(record)}>选择</Button>
                    }
                }
                return elem;
            }
        }]

        const pagination = {
            current: this.state.current,
            total: room.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getRoom(self.postData);
            }
        }

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="帐号">
                        {getFieldDecorator('account', {
                            initialValue: currentWifi.name,
                            rules: [
                                { required: true, message: '帐号不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="密码">
                        {getFieldDecorator('password', {
                            initialValue: currentWifi.pwd,
                            rules: [
                                { required: true, message: '密码不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="使用房间">
                        <div className="room-list">
                            <div className="header">
                                酒店房间号
                            </div>
                            <div className="body">
                                <RoomList dataSource={currentWifi.room_list} onRemove={this.handleRemove.bind(this)}/>
                            </div>
                            <div className="footer">
                                <Button type="primary" onClick={this.showModal.bind(this)}>添加房间</Button>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                        <Button type="primary" htmlType="submit" size="default">保存</Button>
                    </FormItem>
                </Form>
                <Modal
                    title="酒店房间"
                    width={700}
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    style={{top: '30px'}}
                    footer={[
                        <Button key="ok" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                    ]}
                >
                    <div className="ui-box clearfix">
                        <SearchInput placeholder="请输入房间号" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                    </div>
                    <div>
                        <Table
                            columns={columns}
                            dataSource={room.room_list}
                            pagination={pagination}
                            scroll={{ y: 250 }}
                            size="middle"
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

WifiDetail = Form.create()(WifiDetail);

export default WifiDetail;
