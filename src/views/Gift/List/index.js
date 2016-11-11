import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Button, Modal, Table, message } from 'antd'

import action from '../../../store/actions'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class GiftList extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 1
        }
        this.paginationCfg = {
           count: 10,
           offset: 0
        }
    }

    handleDelete(id) {
        this.showConfirm('你确定要删除？', () => {
            var deleteArr = [];
            deleteArr.push(id);

            this.props.action.deleteGift({
                id_list: JSON.stringify(deleteArr)
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

    componentDidMount() {
        this.props.action.getGift(this.paginationCfg);
    }

    componentWillReceiveProps(nextProps) {
        const { gift } = nextProps.state;

        if (gift.status == 'success') {
            message.success(gift.msg);
            this.props.action.getGift(this.paginationCfg);
        } else if (gift.status == 'fail') {
            message.error(gift.msg);
        }
    }

    render() {
        const self = this;
        const { gift } = this.props.state.gift;

        const columns = [{
            title: '标题',
            dataIndex: 'name',
            key: 'name',
            width: '30%'
        }, {
            title: '创建时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created',
            width: '25%'
        }, {
            title: '商品数',
            dataIndex: 'gift_count',
            key: 'gift_count',
            width: '25%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '20%',
            render(text) {
                return (
                    <div>
                        <Link to={`/gift/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleDelete.bind(self, text)}>删除</Link>
                    </div>
                )
            }
        }]

        const pagination = {
            current: this.state.current,
            total: gift.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;

                self.setState({
                    current: page,
                });

                self.props.action.getGift(self.paginationCfg);
            },
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <Button type="primary"><Link to='/gift/detail'>添加</Link></Button>
                </div>
                <div className="ui-box">
                    <Table columns={columns} dataSource={gift.gift_group_list} pagination={pagination} />
                </div>
            </div>
        )
    }
}

export default GiftList;
