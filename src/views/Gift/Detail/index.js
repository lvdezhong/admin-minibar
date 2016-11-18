import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Button, Row, Col, Table, Modal, Form, Input, message } from 'antd'

import action from '../../../store/actions'

import SearchInput from '../../../components/SearchInput'
import GoodsItem from '../../../components/GoodsItem'

import { price } from '../../../utils'

const FormItem = Form.Item;
const confirm = Modal.confirm;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class GiftDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectedArr: [],
            current: 1
        }

        this.paginationCfg = {
           count: 10,
           offset: 0
        }

        this.postData = {}
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            const { gift_list } = this.props.state.gift.currentGift;

            if (gift_list == undefined || gift_list.length == 0) {
                message.error('请正至少选择一件商品！');
                return;
            }

            if (this.isEdit) {
                this.props.action.updateGift({
                    id: this.id,
                    name: values.name,
                    gift_list: JSON.stringify(gift_list)
                })
            } else {
                this.props.action.addGift({
                    name: values.name,
                    gift_list: JSON.stringify(gift_list)
                })
            }
        });
    }

    getIndex(arr, id) {
        let index = -1;

        if (arr.length == 0) {
            return index;
        }

        _.forEach(arr, (item, i) => {
            if (item.item_id == id) {
                return index = i;
            }
        })

        return index;
    }

    showModal() {
        this.setState({
            visible: true
        });

        this.props.action.getGoods(this.paginationCfg);
    }

    goodsItemClick(item) {
        const selectItem = {
            item_id: item.id,
            name: item.name,
            image_horizontal: item.image_horizontal,
            origin_price: item.origin_price
        }
        const { selectedArr } = this.state;
        const _index = this.getIndex(selectedArr, selectItem.item_id);

        if (_index == -1) {
            if (selectedArr.length >= 10) {
                message.warning('所选商品不能超过10个！');
                return;
            }
            selectedArr.push(selectItem);
        } else {
            selectedArr.splice(_index, 1);
        }

        this.setState({
            selectedArr: selectedArr
        })
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
             message.warning('请选择一个商品！');
             return;
        }

        this.props.action.updateGiftList(_selectedArr, 'gift_list');

        this.setState({
            visible: false
        });
    }

    handleSearch(value) {
        this.paginationCfg.offset = 0;
        this.postData = Object.assign({
            name: value
        }, this.paginationCfg);

        this.setState({
            current: 1
        });

        this.props.action.getGoods(this.postData);
    }

    handleRefresh() {
        this.paginationCfg.offset = 0;

        this.setState({
            current: 1
        });

        this.props.action.getGoods(this.paginationCfg).then(function(data) {
            const { code, msg } = data.value;

            if (code == 10000) {
                message.success('刷新成功！')
            } else {
                message.error(msg)
            }
        });
    }

    handleGoodsItemCancel(index) {
        const { selectedArr } = this.state;
        selectedArr.splice(index, 1);

        this.props.action.updateGiftList(selectedArr, 'gift_list');
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        if (this.isEdit) {
            this.props.action.getCurrentGift({
                id: this.id
            }).then(() => {
                const gift_list = this.props.state.gift.currentGift.gift_list || [];
                const _giftList = _.clone(gift_list, true);

                this.setState({
                    selectedArr: _giftList
                });
            });
        } else {
            this.props.action.getNewGift();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        var itemList = nextProps.state.goods.goods.item_list;
        const { selectedArr } = nextState;

        _.forEach(itemList, (item) => {
            const _index = this.getIndex(selectedArr, item.id);

            if (_index == -1) {
                item.selected = false;
            } else {
                item.selected = true;
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const { gift } = nextProps.state;

        if (gift.status == 'success') {
            message.success(gift.msg);
            browserHistory.push('/gift/list');
        } else if (gift.status == 'fail') {
            message.error(gift.msg);
        }
    }

    render() {
        const self = this;

        const { goods } = this.props.state.goods;
        const { currentGift } = this.props.state.gift;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }

        let giftList = [];
        if (currentGift.gift_list) {
            giftList = _.map(currentGift.gift_list, (item, index) => {
                let itemData = {
                    name: item.name,
                    price: item.origin_price,
                    img: item.image_horizontal
                }

                return (
                    <GoodsItem key={item.item_id} dataSource={itemData} onCancel={this.handleGoodsItemCancel.bind(this, index)} />
                )
            })
        }

        const { getFieldDecorator } = this.props.form;

        const columns = [{
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            width: '50%'
        }, {
            title: '类目',
            dataIndex: 'category_name',
            key: 'category_name',
            width: '20%'
        }, {
            title: '原价',
            dataIndex: 'origin_price',
            key: 'origin_price',
            width: '20%',
            render(text) {
                return price('GET', text);
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '10%',
            render(text, record) {
                let elem;
                if (record.selected) {
                    elem = <Button type="primary" size="small" onClick={() => self.goodsItemClick(record)}>已选择</Button>
                } else {
                    elem = <Button type="default" size="small" onClick={() => self.goodsItemClick(record)}>选择</Button>
                }
                return elem;
            }
        }]

        const pagination = {
            current: this.state.current,
            total: goods.total_count,
            onChange(page) {
                self.paginationCfg.offset = (page - 1) * self.paginationCfg.count;
                self.postData = Object.assign(self.postData, self.paginationCfg);

                self.setState({
                    current: page,
                });

                self.props.action.getGoods(self.postData);
            }
        }

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="赠品库标题">
                        {getFieldDecorator('name', {
                            initialValue: currentGift.name,
                            rules: [
                                { required: true, message: '赠品库标题不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="赠品库商品">
                        <Button type="primary" size="small" onClick={this.showModal.bind(this)}>选择商品</Button>
                        <p className="ant-form-text">最多选择10件商品</p>
                        <div>
                            {giftList}
                        </div>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                        <Button type="primary" htmlType="submit" size="default">确定</Button>
                    </FormItem>
                </Form>

                <Modal
                    title="选择商品"
                    width={700}
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    style={{top: '30px'}}
                    footer={[
                        <Button key="ok" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                    ]}
                >
                    <div className="ui-box">
                        <Row>
                            <Col span={12}>
                                <Button type="primary"><Link target="_blank" to="/goods/detail">添加</Link></Button>&nbsp;
                                <Button type="primary" onClick={this.handleRefresh.bind(this)}>刷新</Button>
                            </Col>
                            <Col span={12}>
                                <SearchInput placeholder="请输入商品名称" onSearch={value => this.handleSearch(value)} style={{ width: 200, float: 'right' }} />
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Table columns={columns} dataSource={goods.item_list} pagination={pagination} scroll={{ y: 250 }} size="middle" />
                    </div>
                </Modal>
            </div>
        )
    }
}

GiftDetail = Form.create()(GiftDetail)

export default GiftDetail;
