import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Button, Row, Col, Modal, Table, message } from 'antd'

import SearchInput from '../../../components/SearchInput'

import action from '../../../store/actions'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class TaskList extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 1
        }
        this.paginationCfg = {
           count: 10,
           offset: 0
        }
        this.postData = {
            lifecycle: 0
        }
    }

    handleInvalid(id) {
        this.showConfirm('你确要使这条任务失效？', () => {
            this.props.action.invalidTask({
                id: id
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
            title: value
        }, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getTask(this.postData);
    }

    componentDidMount() {
        this.postData = Object.assign(this.postData, this.paginationCfg);

        this.props.action.getTask(this.postData);
    }

    componentWillReceiveProps(nextProps) {
        const { task } = nextProps.state;

        if (task.status == 'success') {
            message.success(task.msg);
            this.postData = Object.assign(this.postData, this.paginationCfg);
            this.props.action.getTask(this.postData);
        } else if (task.status == 'fail') {
            message.error(task.msg);
        }
    }

    render() {
        const self = this;
        const { task } = this.props.state.task;

        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '20%'
        }, {
            title: '任务类型',
            dataIndex: 'type',
            key: 'type',
            width: '15%',
            render(text) {
                if (text == 1) {
                    return '分享链接'
                } else {
                    return '关注公众号'
                }
            }
        }, {
            title: '有效期',
            key: 'time',
            width: '25%',
            render(text, record) {
                return (
                    `${record.start_time} 至 ${record.end_time}`
                )
            }
        }, {
            title: '参与次数',
            dataIndex: 'join_count',
            key: 'join_count',
            width: '10%'
        }, {
            title: '兑换次数',
            dataIndex: 'accomplish_count',
            key: 'accomplish_count',
            width: '10%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '20%',
            render(text) {
                return (
                    <div>
                        <Link to={`/task/detail/${text}`}>活动数据</Link>-
                        <Link to={`/task/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleInvalid.bind(self, text)}>使失效</Link>
                    </div>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: task.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getTask(self.postData);
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
                            <Button type="primary"><Link to='/task/new'>添加</Link></Button>
                        </Col>
                        <Col span={12}>
                            <SearchInput placeholder="请输入标题" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                        </Col>
                    </Row>
                </div>
                <div className="ui-box">
                    <Table columns={columns} dataSource={task.task_list} pagination={pagination} />
                </div>
            </div>
        )
    }
}

export default TaskList;
