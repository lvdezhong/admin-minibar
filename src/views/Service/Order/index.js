import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Table, Row, Col, message, Modal } from 'antd'

import SearchInput from '../../../components/SearchInput'

import action from '../../../store/actions'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class ServiceOrder extends React.Component {
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
        this.id = props.params.id;

        this.postData = {
            hotel_id: this.hotel_id
        }

        if (this.id) {
            this.postData.service_id = this.id
        }
    }

    componentDidMount() {
        this.postData = Object.assign(this.postData, this.paginationCfg);
        this.props.action.getServiceOrder(this.postData);
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.wifi.errors;
        const nextErrors = nextProps.state.wifi.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleSearch(value) {
        this.paginationCfg.offset = 0;
        this.postData = Object.assign(this.postData, {
            keywords: value
        }, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getServiceOrder(this.postData);
    }

    handleClick(code) {
        this.showConfirm('你确定使用吗？', () => {
            this.props.action.orderConfirm({
                code
            }).then(() => {
                message.success('使用成功');
                this.props.action.getServiceOrder(this.postData);
            }).catch(data => {
                message.error(data.msg);
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
        const { order } = this.props.state.service;

        const columns = [{
            title: '预约房间号',
            dataIndex: 'room_number',
            key: 'room_number',
            width: '14%'
        }, {
            title: '预约活动',
            dataIndex: 'title',
            key: 'title',
            width: '15%'
        }, {
            title: '预约时间',
            dataIndex: 'time',
            key: 'time',
            width: '18%'
        }, {
            title: '预约人数',
            dataIndex: 'count',
            key: 'count',
            width: '10%'
        }, {
            title: '联系电话',
            dataIndex: 'mobile',
            key: 'mobile',
            width: '15%'
        }, {
            title: '使用情况',
            dataIndex: 'used',
            key: 'used',
            width: '18%',
            render(text, record) {
                if (text == 0) {
                    return '未使用'
                } else {
                    return (
                        <div>
                            <p>已使用</p>
                            <p>{record.time}</p>
                        </div>
                    )
                }
            }
        }, {
            title: '操作',
            dataIndex: 'code',
            key: 'operate',
            width: '10%',
            render(text) {
                return (
                    <Link onClick={self.handleClick.bind(self, text)}>确认使用</Link>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: order.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getServiceOrder(self.postData);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <div className="tab">
                        <Link to='/service/list'>所有服务</Link>
                        <Link className="active" to='/service/order'>预约服务</Link>
                    </div>
                </div>
                <div className="ui-box">
                    <Row>
                        <Col>
                            <SearchInput placeholder="请输入标题" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                        </Col>
                    </Row>
                </div>
                <div className="ui-box">
                    <Table
                        columns={columns}
                        dataSource={order.service_appointment_list}
                        pagination={pagination}
                    />
                </div>
            </div>
        )
    }
}

export default ServiceOrder;
