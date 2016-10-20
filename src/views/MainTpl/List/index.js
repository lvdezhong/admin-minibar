import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Table, Tag, Row, Col, Button, Modal, message } from 'antd'

import SearchInput from '../../../components/SearchInput'

import { getMainTpl, copyMainTpl, deleteMainTpl, setMainTpl } from '../../../actions/maintpl'

const confirm = Modal.confirm;

class MainTplList extends React.Component {
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

    handleCopy(id) {
        const { copyMainTpl } = this.props;

        this.showConfirm('复制模版？', () => {
            copyMainTpl({
                id: id
            }).payload.promise.then(function(data) {
                const { code, msg } = data.payload;

                if (code == 10000) {
                    message.success('操作成功！');
                } else {
                    message.error(msg);
                }
            });
        });
    }

    handleDelete(id) {
        const { deleteMainTpl } = this.props;

        this.showConfirm('你确定要删除？', () => {
            deleteMainTpl({
                id: id
            }).payload.promise.then(data => {
                const { code, msg } = data.payload;

                if (code == 10000) {
                    message.success('操作成功！');
                } else {
                    message.error(msg);
                }
            });
        });
    }

    handleSet(id) {
        const { setMainTpl } = this.props;

        this.showConfirm('设为默认？', () => {
            setMainTpl({
                id: id
            }).payload.promise.then(function(data) {
                const { code, msg } = data.payload;

                if (code == 10000) {
                    message.success('操作成功！');
                } else {
                    message.error(msg);
                }
            });
        });
    }

    handleSearch(value) {
        const { getMainTpl } = this.props;

        this.paginationCfg.offset = 0;
        this.postData = Object.assign({
            name: value
        }, this.paginationCfg);

        this.setState({
            current: 1
        });

        getMainTpl(this.postData);
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

    componentDidMount() {
        const { getMainTpl } = this.props;

        getMainTpl(this.paginationCfg);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isUpdate) {
            this.paginationCfg.offset = 0;

            this.setState({
                current: 1
            });

            this.props.getMainTpl(this.paginationCfg);
        }
    }

    render() {
        const self = this;
        const { maintpl } = this.props
        const columns = [{
            title: '标题',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '创建时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            render(text, record) {
                const elem = record.default_flag ? '默认' : '设为默认';
                return (
                    <div>
                        <Link onClick={self.handleCopy.bind(self, text)}>复制</Link>-
                        <Link onClick={self.handleDelete.bind(self, text)}>删除</Link>-
                        <Link to={`/maintpl/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleSet.bind(self, text)}>{elem}</Link>
                    </div>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: maintpl.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.getMainTpl(self.postData);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <Row>
                        <Col span={12}>
                            <Button type="primary"><Link to="/maintpl/detail">添加</Link></Button>
                        </Col>
                        <Col span={12}>
                            <SearchInput placeholder="请输入标题" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                        </Col>
                    </Row>
                </div>
                <div className="ui-box">
                    <Table columns={columns} dataSource={maintpl.machine_tmpl_list} pagination={pagination} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { maintpl, isPending, errors, isUpdate } = state.maintpl;
    return {
        maintpl: maintpl,
        isPending: isPending,
        errors: errors,
        isUpdate: isUpdate
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getMainTpl: bindActionCreators(getMainTpl, dispatch),
        copyMainTpl: bindActionCreators(copyMainTpl, dispatch),
        deleteMainTpl: bindActionCreators(deleteMainTpl, dispatch),
        setMainTpl: bindActionCreators(setMainTpl, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainTplList)
