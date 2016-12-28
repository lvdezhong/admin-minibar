import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Table, Row, Col, Button, message, Modal } from 'antd'

import SearchInput from '../../../components/SearchInput'

import action from '../../../store/actions'

import './index.less'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class ServiceList extends React.Component {
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
        this.props.action.getService(this.postData);
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.service.errors;
        const nextErrors = nextProps.state.service.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleDelete(id) {
        this.showConfirm('你确定要删除？', () => {
            this.props.action.deleteService({
                id
            }).then(() => {
                message.success('删除成功');
                this.props.action.getService(this.postData);
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

    handleSearch(value) {
        this.paginationCfg.offset = 0;
        this.postData = Object.assign(this.postData, {
            keywords: value
        }, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getService(this.postData);
    }

    render() {
        const self = this;
        const { service } = this.props.state.service;

        const columns = [{
            title: '服务名称',
            dataIndex: 'title',
            key: 'title',
            width: '20%'
        }, {
            title: '创建时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created',
            width: '20%'
        }, {
            title: '预约人次',
            dataIndex: 'ask_count',
            key: 'ask_count',
            width: '20%'
        }, {
            title: '使用人次',
            dataIndex: 'use_count',
            key: 'use_count',
            width: '20%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '20%',
            render(text) {
                return (
                    <div>
                        <Link to={`/service/order/${text}`}>预约情况</Link>-
                        <Link to={`/service/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleDelete.bind(self, text)}>删除</Link>
                    </div>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: service.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getService(self.postData);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <div className="tab">
                        <Link className="active" to='/service/list'>所有服务</Link>
                        <Link to='/service/order'>预约服务</Link>
                    </div>
                </div>
                <div className="ui-box">
                    <Row>
                        <Col span={12}>
                            <Button type="primary"><Link to="/service/detail">添加</Link></Button>
                        </Col>
                        <Col span={12}>
                            <SearchInput placeholder="请输入标题" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                        </Col>
                    </Row>
                </div>
                <div className="ui-box">
                    <Table
                        columns={columns}
                        dataSource={service.service_list}
                        pagination={pagination}
                    />
                </div>
            </div>
        )
    }
}

export default ServiceList;
