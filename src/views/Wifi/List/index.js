import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Table, Row, Col, Button, message, Switch, Modal } from 'antd'

import action from '../../../store/actions'

import './index.less'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class WifiList extends React.Component {
    constructor(props) {
        super()
        this.state = {
            current: 1
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
        this.postData = Object.assign(this.postData, this.paginationCfg);
        this.props.action.getWifi(this.postData);
        this.props.action.getWifiState({
            hotel_id: this.hotel_id,
            type: 0
        });
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.wifi.errors;
        const nextErrors = nextProps.state.wifi.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleChange() {
        this.props.action.setWifiState({
            hotel_id: this.hotel_id,
            type: 0
        });
    }

    handleDelete(id) {
        this.showConfirm('你确定要删除？', () => {
            this.props.action.deleteWifi({
                id
            }).then(() => {
                message.success('删除成功');
                this.props.action.getWifi(this.postData);
            });
        });
    }

    showConfirm(title, cb) {
        const self = this;
        confirm({
            title: title,
            onOk() {
                cb && cb();
            }
        });
    }

    render() {
        const self = this;
        const { wifi, wifiState } = this.props.state.wifi;

        const columns = [{
            title: 'wifi名称',
            dataIndex: 'name',
            key: 'name',
            width: '40%'
        }, {
            title: 'wifi密码',
            dataIndex: 'pwd',
            key: 'pwd',
            width: '40%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '20%',
            render(text) {
                return (
                    <div>
                        <Link to={`/wifi/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleDelete.bind(self, text)}>删除</Link>
                    </div>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: wifi.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getWifi(self.postData);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <div className="title-switch">
                        <Row>
                            <Col span={12}>
                                <h3>wifi密码</h3>
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                                <Switch
                                    checked={wifiState == 0 ? false : true}
                                    onChange={this.handleChange.bind(this)}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="ui-box">
                    <Button type="primary"><Link to="/wifi/detail">添加</Link></Button>
                </div>
                <div className="ui-box">
                    <Table
                        columns={columns}
                        dataSource={wifi.wifi_config_list}
                        pagination={pagination}
                    />
                </div>
            </div>
        )
    }
}

export default WifiList;
