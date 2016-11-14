import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Row, Col, Button, Table, Tag, Modal, message } from 'antd'

import action from '../../../store/actions'

import { price } from '../../../utils'

import './index.less'

const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class GoodsList extends React.Component {
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
        this.selectedArr = []
    }

    handleDelete(id) {
        let idList = [];
        idList.push(id);
        this.showConfirm('你确定要删除？', () => {
            this.doDelete(idList);
        });
    }

    handleDeleteBatch() {
        this.selectedArr = this.selectedArr.map((item) => item.id);
        this.showConfirm('你确定要批量删除选中的商品吗？', () => {
            this.doDelete(this.selectedArr);
        });
    }

    doDelete(idList) {
        this.props.action.deleteGoods({
            id_list: JSON.stringify(idList)
        }).then(function(data) {
            const { code, msg } = data.value;

            if (code == 10000) {
                message.success('操作成功！');
            } else {
                message.error(msg);
            }
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

    handleTableChange(pagination, filters, sorter) {
        if (sorter.columnKey == 'origin_price') {
            this.postData = {
                order_by: 'price',
                asc: sorter.order == 'ascend' ? 'asc' : 'desc'
            }
        } else if (sorter.columnKey == 'gmt_created') {
            this.postData = {
                order_by: 'gmt_created',
                asc: sorter.order == 'ascend' ? 'asc' : 'desc'
            }
        }

        this.paginationCfg.offset = (pagination.current - 1) * this.paginationCfg.count;
        this.postData = Object.assign(this.postData, this.paginationCfg);

        this.setState({
            current: pagination.current,
        });

        this.props.action.getGoods(this.postData)
    }

    componentDidMount() {
        this.props.action.getGoods(this.paginationCfg);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isUpdate) {
            this.paginationCfg.offset = 0;

            this.setState({
                current: 1
            });

            this.props.action.getGoods(this.paginationCfg);
        }
    }

    render() {
        const self = this;
        const { goods } = this.props.state.goods;
        const columns = [{
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render(text, record) {
                return (
                    <div className="goods">
                        <div className="img" style={{backgroundImage: `url(${record.image_horizontal})`}}></div>
                        <p>{record.name}</p>
                    </div>
                )
            }
        }, {
            title: '录入时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created',
            sorter: true,
            width: '20%'
        }, {
            title: '类目',
            dataIndex: 'category_name',
            key: 'category_name',
            width: '15%'
        }, {
            title: '商品价格',
            dataIndex: 'origin_price',
            key: 'origin_price',
            sorter: true,
            width: '15%',
            render(text) {
                return price('GET', text);
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '20%',
            render(text) {
                return (
                    <div>
                        <Link to={`/goods/detail/${text}`}>编辑</Link>-
                        <Link onClick={self.handleDelete.bind(self, text)}>删除</Link>
                    </div>
                )
            }
        }]

        const rowSelection = {
            onSelect(record, selected, selectedRows) {
                self.selectedArr = selectedRows;
            },
            onSelectAll(selected, selectedRows, changeRows) {
                self.selectedArr = selectedRows;
            }
        }

        const pagination = {
            current: this.state.current,
            total: goods.total_count,
            showTotal(total) {
                return `共 ${total} 条`
            }
        }

        return (
            <div>
                <div className="ui-box">
                    <Button type="primary"><Link to="/goods/detail">添加</Link></Button>&nbsp;
                    <Button type="default" onClick={this.handleDeleteBatch.bind(this)}>批量删除</Button>
                </div>
                <div className="ui-box">
                    <Table rowSelection={rowSelection} columns={columns} dataSource={goods.item_list} pagination={pagination} onChange={this.handleTableChange.bind(this)} />
                </div>
            </div>
        )
    }
}

export default GoodsList;
