import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Form, Input, Row, Col, Radio, Button, Modal, Table, Tag, message } from 'antd'
import PubSub from 'pubsub-js'

import action from '../../store/actions'

import { CLICK_GOODS_ITEM, UPDATE_GOODS_ITEM, price } from '../../utils'

import SearchInput from '../SearchInput'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class GridForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            index: null,
            currentIndex: 0,
            current: 1
        }

        this.paginationCfg = {
           count: 10,
           offset: 0
        }

        this.postData = {}

        switch (props.keyword) {
            case 'device':
                const { machine_item_list } = props.state.device.currentDevice;
                this.goodsCache = machine_item_list.slice(0);
                break;
            case 'maintpl':
                const { tmpl_item_list } = props.state.maintpl.currentMainTpl;
                this.goodsCache = tmpl_item_list.slice(0);
                break;
        }
    }

    showModal() {
        this.setState({
            visible: true,
            index: null
        });

        this.props.action.getGoods(this.paginationCfg);
    }

    goodsItemClick(selected, index) {
        this.setState({
            index: index
        });
    }

    handleOk() {
        const { goods } = this.props.state.goods;
        const { index, currentIndex } = this.state;

        if (index != null) {
            const item = {
                origin_item_id: goods.item_list[index].id,
                name: goods.item_list[index].name,
                image_horizontal: goods.item_list[index].image_horizontal,
                image_vertical: goods.item_list[index].image_vertical,
                origin_price: goods.item_list[index].origin_price,
                isDefault: false
            }

            this.goodsCache[currentIndex] = Object.assign({}, this.goodsCache[currentIndex], item)

            this.setState({
                visible: false
            });
        } else {
            message.warning('请选择一个商品！');
        }
    }

    handleCancel(e) {
        this.setState({
            visible: false
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { keyword } = this.props;
        const { currentIndex, index } = this.state;
        const currentGoods = this.goodsCache[currentIndex];

        if (currentGoods.isDefault == true) {
             message.error('请选择一个商品！');
             return
        }

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写商品信息！');
                return;
            }

            values.price = Number(price('POST', values.price));
            values.stock_num = Number(values.stock_num);
            values.max_stock_num = Number(values.max_stock_num);
            values.status = Number(values.status);

            const pushData = Object.assign({}, currentGoods, values)

            PubSub.publish(UPDATE_GOODS_ITEM, currentIndex);
            switch (keyword) {
                case 'device':
                    this.props.action.pushDeviceGoodsItem(currentIndex, pushData);
                    break;
                case 'maintpl':
                    this.props.action.pushMainTplGoodsItem(currentIndex, pushData);
                    break;
            }
            message.success('修改成功！');
        })
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

        this.props.action.getGoods(this.paginationCfg).payload.promise.then(function(data) {
            const { code, msg } = data.payload;

            if (code == 10000) {
                message.success('刷新成功！')
            } else {
                message.error(msg)
            }
        });
    }

    checkStock(rule, value, callback) {
        const { validateFields } = this.props.form;

        if (value) {
          validateFields(['max_stock_num'], { force: true });
        }
        callback();
    }

    checkMaxStock(rule, value, callback) {
        const { getFieldValue } = this.props.form;

        if (value && value < getFieldValue('stock_num')) {
            callback('最大库存不能小于库存');
        } else {
            callback();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const index = this.state.index;
        const nextIndex = nextState.index;
        var nextGoods = nextProps.state.goods.goods.item_list;

        if (nextIndex != null && index != nextIndex) {
            for (let i = 0; i < nextGoods.length; i ++) {
                nextGoods[i].selected = false;
            }
            nextGoods[nextIndex].selected = true;
        }
    }

    componentDidMount() {
        this.pubsub_token = PubSub.subscribe(CLICK_GOODS_ITEM, function(msg, data) {
            this.setState({
                currentIndex: data,
                index: null
            });

            const { keyword } = this.props;

            switch (keyword) {
                case 'device':
                    const { machine_item_list } = this.props.state.device.currentDevice
                    var currentGoods = machine_item_list[data];
                    break;
                case 'maintpl':
                    const { tmpl_item_list } = this.props.state.maintpl.currentMainTpl;
                    var currentGoods = tmpl_item_list[data];
                    break;
            }

            this.goodsCache[data] = currentGoods;

            this.props.form.setFieldsValue({
                price: price('GET', currentGoods.price),
                stock_num: currentGoods.stock_num.toString(),
                max_stock_num: currentGoods.max_stock_num.toString(),
                status: `${currentGoods.status}`
            });
        }.bind(this));

        PubSub.publish(CLICK_GOODS_ITEM, this.state.currentIndex);
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }

    render() {
        const self = this;

        const { goods } = this.props.state.goods;
        const { currentIndex } = this.state;
        const currentGoods = this.goodsCache[currentIndex];

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
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
            render(text, record, index) {
                let elem;
                if (record.selected) {
                    elem = <Button type="primary" size="small" onClick={() => self.goodsItemClick(record.select, index)}>选择</Button>
                } else {
                    elem = <Button type="default" size="small" onClick={() => self.goodsItemClick(record.select, index)}>选择</Button>
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
                    <FormItem {...formItemLayout} label="商品名称">
                        <p className="ant-form-text">{currentGoods.name}</p>
                        <Button type="primary" size="small" onClick={this.showModal.bind(this)}>选择商品</Button>
                    </FormItem>
                    <FormItem {...formItemLayout} label="价格">
                        <p className="ant-form-text">{price('GET', currentGoods.origin_price)}</p>
                    </FormItem>
                    <FormItem {...formItemLayout} label="现价">
                        {getFieldDecorator('price', {
                            rules: [
                                { required: true, message: '商品现价不能为空' },
                                { pattern: /^\d+(?:\.\d{1,2})?$/, message: '价格不能超过两位小数' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="库存">
                        {getFieldDecorator('stock_num', {
                            rules: [
                                { required: true, message: '商品库存不能为空' },
                                { pattern: /^[1-9]\d*$/, message: '商品库存请填写数字' },
                                { validator: this.checkStock.bind(this) }
                            ]
                        })(
                            <Input />
                        )}
                        <span>当前剩余库存：{currentGoods.stock_num}</span>
                    </FormItem>
                    <FormItem {...formItemLayout} label="最大库存">
                        {getFieldDecorator('max_stock_num', {
                            rules: [
                                { required: true, message: '最大库存不能为空' },
                                { pattern: /^[1-9]\d*$/, message: '商品库存请填写数字' },
                                { validator: this.checkMaxStock.bind(this) }
                            ]
                        })(
                            <Input placeholder="最大库存用于补货端批量补货" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="状态">
                        {getFieldDecorator('status')(
                            <RadioGroup>
                                <Radio value="1">启用</Radio>
                                <Radio value="0">禁用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                        <Button type="primary" htmlType="submit" size="default">确定</Button>
                    </FormItem>
                </Form>
                <Modal title="选择商品" width={700} visible={this.state.visible} onCancel={this.handleCancel.bind(this)} footer={[<Button key="ok" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>]}>
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
                        <Table columns={columns} dataSource={goods.item_list} pagination={pagination} size="middle" />
                    </div>
                </Modal>
            </div>
        )
    }
}

GridForm = Form.create()(GridForm);

export default GridForm;
