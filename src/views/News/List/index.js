import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Table, Row, Col, Button, message, Switch, Modal } from 'antd'

import SearchInput from '../../../components/SearchInput'

import action from '../../../store/actions'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class newList extends React.Component {
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
        this.props.action.getNews(this.postData);
        this.props.action.getNewsState({
            hotel_id: this.hotel_id,
            type: 2
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
        this.props.action.setNewsState({
            hotel_id: this.hotel_id,
            type: 2
        });
    }

    handleDelete(id) {
        this.showConfirm('你确定要删除？', () => {
            this.props.action.deleteNews({
                id
            }).then(() => {
                message.success('删除成功');
                this.props.action.getNews(this.postData);
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

        this.props.action.getNews(this.postData);
    }

    render() {
        const self = this;
        const { news, newsState } = this.props.state.news;

        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '20%'
        }, {
            title: '创建时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created',
            width: '20%'
        }, {
            title: 'PV',
            dataIndex: 'pv',
            key: 'pv',
            width: '20%'
        }, {
            title: 'UV',
            dataIndex: 'uv',
            key: 'uv',
            width: '20%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '20%',
            render(text) {
                return (
                    <div>
                        <Link to={`/news/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleDelete.bind(self, text)}>删除</Link>
                    </div>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: news.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getNews(self.postData);
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
                                <h3>最新资讯</h3>
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                                <Switch
                                    checked={newsState == 0 ? false : true}
                                    onChange={this.handleChange.bind(this)}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="ui-box">
                    <Row>
                        <Col span={12}>
                            <Button type="primary"><Link to="/news/detail">添加</Link></Button>
                        </Col>
                        <Col span={12}>
                            <SearchInput placeholder="请输入标题" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                        </Col>
                    </Row>
                </div>
                <div className="ui-box">
                    <Table
                        columns={columns}
                        dataSource={news.news_list}
                        pagination={pagination}
                    />
                </div>
            </div>
        )
    }
}

export default newList;
