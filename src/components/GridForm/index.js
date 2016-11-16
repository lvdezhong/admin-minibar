import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Form, Input, Row, Col, Radio, Button, Modal, Table, Tag, message, Tabs } from 'antd'
import PubSub from 'pubsub-js'

import action from '../../store/actions'
import GoodsItem from '../GoodsItem'

import { CLICK_GOODS_ITEM, UPDATE_GOODS_ITEM, price } from '../../utils'

import SearchInput from '../SearchInput'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class GridForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            currentIndex: 0,
            selectedGoods: null,
            selectedTask: null,
            pageGoods: 1,
            pageTask: 1,
            type: 0
        }

        this.paginationCfgGoods = {
           count: 10,
           offset: 0
        }

        this.paginationCfgTask = {
           count: 10,
           offset: 0
        }

        this.postDataGoods = {}

        this.postDataTask = {
            lifecycle: 2
        }

        this.type = 0;

        this.goodsCache = _.clone(props.dataSource, true);
    }

    showModal() {
        this.setState({
            visible: true,
            selectedGoods: null,
            selectedTask: null
        });

        this.postDataGoods = Object.assign(this.postDataGoods, this.paginationCfgGoods);
        this.postDataTask = Object.assign(this.postDataTask, this.paginationCfgTask);

        this.props.action.getGoods(this.postDataGoods);
        this.props.action.getTask(this.postDataTask);
    }

    goodsItemClick(index) {
        this.setState({
            selectedGoods: index
        });
    }

    taskItemClick(index) {
        this.setState({
            selectedTask: index
        });
    }

    handleOk() {
        const { item_list } = this.props.state.goods.goods;
        const { task_list } = this.props.state.task.task;
        const { selectedGoods, selectedTask, currentIndex } = this.state;

        if (selectedGoods != null) {
            const item = {
                origin_item_id: item_list[selectedGoods].id,
                name: item_list[selectedGoods].name,
                image_horizontal: item_list[selectedGoods].image_horizontal,
                image_vertical: item_list[selectedGoods].image_vertical,
                origin_price: item_list[selectedGoods].origin_price,
                isDefault: false,
                content_type: this.type
            }

            this.goodsCache[currentIndex] = Object.assign({}, this.goodsCache[currentIndex], item)

            this.props.form.setFieldsValue({
                price: price('GET', this.goodsCache[currentIndex].price),
                goods_stock_num: this.goodsCache[currentIndex].stock_num.toString(),
                goods_max_stock_num: this.goodsCache[currentIndex].max_stock_num.toString(),
                goods_status: `${this.goodsCache[currentIndex].status}`
            });

            this.setState({
                visible: false,
                type: this.type
            });
        } else if (selectedTask != null) {
            const item = {
                task_id: task_list[selectedTask].id,
                isDefault: false,
                content_type: this.type,
                extro_info: {
                    title: task_list[selectedTask].title,
                    start_time: task_list[selectedTask].start_time,
                    end_time: task_list[selectedTask].end_time,
                    task_item_list: task_list[selectedTask].task_item_list
                }
            }

            this.goodsCache[currentIndex] = Object.assign({}, this.goodsCache[currentIndex], item)

            this.props.form.setFieldsValue({
                task_stock_num: this.goodsCache[currentIndex].stock_num.toString(),
                task_max_stock_num: this.goodsCache[currentIndex].max_stock_num.toString(),
                task_status: `${this.goodsCache[currentIndex].status}`
            });

            this.setState({
                visible: false,
                type: this.type
            });
        } else {
            message.warning('请选择一个商品或营销活动！');
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
        const { currentIndex } = this.state;
        const currentGoods = this.goodsCache[currentIndex];

        if (currentGoods.isDefault == true) {
             message.error('请选择一个商品或营销活动！');
             return
        }

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写表单信息！');
                return;
            }

            if (currentGoods.content_type == 0) {
                var formData = {
                    price: Number(price('POST', values.price)),
                    stock_num: Number(values.goods_stock_num),
                    max_stock_num: Number(values.goods_max_stock_num),
                    status: Number(values.goods_status)
                }
            } else {
                var formData = {
                    stock_num: Number(values.task_stock_num),
                    max_stock_num: Number(values.task_max_stock_num),
                    status: Number(values.task_status)
                }
            }

            var pushData = Object.assign({}, currentGoods, formData);

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

    handleSearchGoods(value) {
        this.paginationCfgGoods.offset = 0;
        this.postDataGoods = Object.assign({
            name: value
        }, this.paginationCfgGoods);

        this.setState({
            pageGoods: 1
        });

        this.props.action.getGoods(this.postDataGoods);
    }

    handleSearchTask(value) {
        this.paginationCfgTask.offset = 0;
        this.postDataTask = Object.assign({
            title: value
        }, this.paginationCfgTask);

        this.setState({
            pageTask: 1
        });

        this.props.action.getTask(this.postDataTask);
    }

    handleRefreshGoods() {
        this.paginationCfgGoods.offset = 0;

        this.setState({
            pageGoods: 1
        });

        this.props.action.getGoods(this.paginationCfgGoods).then(function(data) {
            const { code, msg } = data.value;

            if (code == 10000) {
                message.success('刷新成功！')
            } else {
                message.error(msg)
            }
        });
    }

    handleRefreshTask() {
        this.paginationCfgTask.offset = 0;

        this.setState({
            pageTask: 1
        });

        this.props.action.getTask(this.paginationCfgTask).then(function(data) {
            const { code, msg } = data.value;

            if (code == 10000) {
                message.success('刷新成功！')
            } else {
                message.error(msg)
            }
        });
    }

    handleChange(type) {
        this.type = type
    }

    checkStock(rule, value, callback) {
        const { validateFields } = this.props.form;
        const { type } = this.state;

        if (value && type == 0) {
            validateFields(['goods_max_stock_num'], { force: true });
        } else if (value && type == 1) {
            validateFields(['task_max_stock_num'], { force: true });
        }
        callback();
    }

    checkMaxStock(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        const { type } = this.state;

        if (value && type == 0 && value < getFieldValue('goods_stock_num')) {
            callback('最大库存不能小于库存');
        } else if (value && type == 1 && value < getFieldValue('task_stock_num')) {
            callback('最大库存不能小于库存');
        } else {
            callback();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        var { item_list } = nextProps.state.goods.goods;
        var { task_list } = nextProps.state.task.task;

        if (nextState.selectedGoods != null && this.state.selectedGoods != nextState.selectedGoods) {
            _.forEach(item_list, function(item) {
                item.selected = false;
            })
            _.forEach(task_list, function(item) {
                item.selected = false;
            })
            item_list[nextState.selectedGoods].selected = true;
        }

        if (nextState.selectedTask != null && this.state.selectedTask != nextState.selectedTask) {
            _.forEach(task_list, function(item) {
                item.selected = false;
            })
            _.forEach(item_list, function(item) {
                item.selected = false;
            })
            task_list[nextState.selectedTask].selected = true;
        }
    }

    componentDidMount() {
        this.pubsub_token = PubSub.subscribe(CLICK_GOODS_ITEM, (msg, data) => {
            this.setState({
                currentIndex: data.index,
                selectedGoods: null,
                selectedTask: null
            });

            const currentGoods = this.props.dataSource[data.index];

            this.goodsCache[data.index] = currentGoods;

            if (currentGoods.content_type == 0) {
                this.props.form.setFieldsValue({
                    price: price('GET', currentGoods.price),
                    goods_stock_num: currentGoods.stock_num.toString(),
                    goods_max_stock_num: currentGoods.max_stock_num.toString(),
                    goods_status: `${currentGoods.status}`
                });
            } else {
                this.props.form.setFieldsValue({
                    task_stock_num: currentGoods.stock_num.toString(),
                    task_max_stock_num: currentGoods.max_stock_num.toString(),
                    task_status: `${currentGoods.status}`
                });
            }

            this.setState({
                type: currentGoods.content_type
            });
        });

        PubSub.publish(CLICK_GOODS_ITEM, {
            index: this.state.currentIndex
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataSource != nextProps.dataSource) {
            this.goodsCache = _.clone(nextProps.dataSource, true);

            PubSub.publish(CLICK_GOODS_ITEM, {
                index: this.state.currentIndex
            });
        }
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token);
    }

    render() {
        const self = this;
        const { goods } = this.props.state.goods;
        const { task } = this.props.state.task;
        const { currentIndex } = this.state;
        const currentGoods = this.goodsCache[currentIndex];

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        }

        const { getFieldDecorator } = this.props.form;

        const columnsGoods = [{
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
                    elem = <Button type="primary" size="small" onClick={() => self.goodsItemClick(index)}>选择</Button>
                } else {
                    elem = <Button type="default" size="small" onClick={() => self.goodsItemClick(index)}>选择</Button>
                }
                return elem;
            }
        }]

        const paginationGoods = {
            current: this.state.pageGoods,
            total: goods.total_count,
            onChange(page) {
                self.paginationCfgGoods.offset = (page - 1) * self.paginationCfgGoods.count;
                self.postDataGoods = Object.assign(self.postDataGoods, self.paginationCfgGoods);

                self.setState({
                    pageGoods: page,
                });

                self.props.action.getGoods(self.postDataGoods);
            }
        }

        const columnsTask = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '20%'
        }, {
            title: '任务类型',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
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
            width: '50%',
            render(text, record) {
                return (
                    `${record.start_time} 至 ${record.end_time}`
                )
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '10%',
            render(text, record, index) {
                let elem;
                if (record.selected) {
                    elem = <Button type="primary" size="small" onClick={() => self.taskItemClick(index)}>选择</Button>
                } else {
                    elem = <Button type="default" size="small" onClick={() => self.taskItemClick(index)}>选择</Button>
                }
                return elem;
            }
        }]

        const paginationTask = {
            current: this.state.pageTask,
            total: task.total_count,
            onChange(page) {
                self.paginationCfgTask.offset = (page - 1) * self.paginationCfgTask.count;
                self.postDataTask = Object.assign(self.postDataTask, self.paginationCfgTask);

                self.setState({
                    pageTask: page
                });

                self.props.action.getTask(self.postDataTask);
            }
        }

        if (currentGoods.content_type == 0) {
            var elem = <div>
                <FormItem {...formItemLayout} label="商品名称">
                    <p className="ant-form-text">{currentGoods.name}</p>
                    <Button type="primary" size="small" onClick={this.showModal.bind(this)}>选择商品/营销活动</Button>
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
                    {getFieldDecorator('goods_stock_num', {
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
                    {getFieldDecorator('goods_max_stock_num', {
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
                    {getFieldDecorator('goods_status')(
                        <RadioGroup>
                            <Radio value="1">启用</Radio>
                            <Radio value="0">禁用</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
            </div>
        } else {
            var giftList = [];
            if (currentGoods.extro_info) {
                giftList = _.map(currentGoods.extro_info.task_item_list, (item, index) => {
                    let itemData = {
                        name: item.name,
                        price: item.origin_price,
                        img: item.image_horizontal
                    }

                    return (
                        <GoodsItem key={item.id} dataSource={itemData} closable={false} />
                    )
                })
            }

            var elem = <div>
                <FormItem {...formItemLayout} label="活动名称">
                    <p className="ant-form-text">{currentGoods.extro_info && currentGoods.extro_info.title}</p>
                    <Button type="primary" size="small" onClick={this.showModal.bind(this)}>选择商品/营销活动</Button>
                </FormItem>
                <FormItem {...formItemLayout} label="有效期">
                    <p className="ant-form-text">{`${currentGoods.extro_info && currentGoods.extro_info.start_time} 到 ${currentGoods.extro_info && currentGoods.extro_info.end_time}`}</p>
                </FormItem>
                <FormItem {...formItemLayout} label="库存">
                    {getFieldDecorator('task_stock_num', {
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
                    {getFieldDecorator('task_max_stock_num', {
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
                    {getFieldDecorator('task_status')(
                        <RadioGroup>
                            <Radio value="1">启用</Radio>
                            <Radio value="0">禁用</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="赠送商品">
                    {giftList}
                </FormItem>
            </div>
        }

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    {elem}
                    <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                        <Button type="primary" htmlType="submit" size="default">确定</Button>
                    </FormItem>
                </Form>
                <Modal
                    title="选择商品"
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    width={700}
                    footer={[
                        <Button key="ok" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                    ]}
                >
                    <Tabs defaultActiveKey="0" size="small" onChange={this.handleChange.bind(this)}>
                        <TabPane tab="商品" key="0">
                            <div className="ui-box">
                                <Row>
                                    <Col span={12}>
                                        <Button type="primary"><Link target="_blank" to="/goods/detail">添加</Link></Button>&nbsp;
                                        <Button type="primary" onClick={this.handleRefreshGoods.bind(this)}>刷新</Button>
                                    </Col>
                                    <Col span={12}>
                                        <SearchInput placeholder="请输入商品名称" onSearch={value => this.handleSearchGoods(value)} style={{ width: 200, float: 'right' }} />
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Table columns={columnsGoods} dataSource={goods.item_list} pagination={paginationGoods} size="middle" />
                            </div>
                        </TabPane>
                        <TabPane tab="营销" key="1">
                            <div className="ui-box">
                                <Row>
                                    <Col span={12}>
                                        <Button type="primary"><Link target="_blank" to="/task/new">添加</Link></Button>&nbsp;
                                        <Button type="primary" onClick={this.handleRefreshTask.bind(this)}>刷新</Button>
                                    </Col>
                                    <Col span={12}>
                                        <SearchInput placeholder="请输入商品名称" onSearch={value => this.handleSearchTask(value)} style={{ width: 200, float: 'right' }} />
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Table columns={columnsTask} dataSource={task.task_list} pagination={paginationTask} size="middle" />
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

GridForm = Form.create()(GridForm);

export default GridForm;
