import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Button, Row, Col, Form, Modal, Input, Table, DatePicker, message, Tabs } from 'antd'
import moment from 'moment';

import action from '../../../store/actions'

import SearchInput from '../../../components/SearchInput'
import GoodsItem from '../../../components/GoodsItem'

import { price } from '../../../utils'

import 'wangeditor/dist/css/wangEditor.min.css'
import 'wangeditor'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class TaskDetail extends React.Component {
    constructor() {
        super()

        this.state = {
            visible: false,
            selectedArr: [],
            currentGoods: 1,
            currentGift: 1
        }

        this.paginationCfgGoods = {
           count: 10,
           offset: 0
        }

        this.paginationCfgGift = {
           count: 10,
           offset: 0
        }

        this.postDataGoods = {}
        this.postDataGift = {}

        this.fetchLock = false;
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
        const task_item_list = this.props.state.task.currentTask.task_item_list || [];
        const _task_item_list = _.clone(task_item_list, true);

        this.setState({
            visible: true,
            selectedArr: _task_item_list
        });

        this.props.action.getGoods(this.paginationCfgGoods);
        this.props.action.getGift(this.paginationCfgGift);
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

    giftItemClick(item) {
        this.props.action.getCurrentGift({
            id: item.id
        }).then(data => {
            const { code, msg } = data.value;

            if (code == 10000) {
                this.setState({
                    selectedArr: data.value.data.gift_group.gift_list
                })

                message.success(`已选择赠品库 ${item.name} 中的所有商品！`);
            } else {
                message.error(msg);
            }
        });
    }

    handleCancel() {
        this.setState({
            visible: false
        });
    }

    handleOk() {
        const { selectedArr } = this.state;

        if (selectedArr.length == 0) {
             message.warning('请选择一个商品！');
             return;
        }

        this.props.action.updateTaskItemList(selectedArr);

        this.setState({
            visible: false
        });
    }

    handleSearchGoods(value) {
        this.paginationCfgGoods.offset = 0;
        this.postDataGoods = Object.assign({
            name: value
        }, this.paginationCfgGoods);

        this.setState({
            currentGoods: 1
        });

        this.props.action.getGoods(this.postDataGoods);
    }

    handleRefreshGoods() {
        this.paginationCfgGoods.offset = 0;

        this.setState({
            currentGoods: 1
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

    handleSearchGift(value) {
        this.paginationCfgGift.offset = 0;
        this.postDataGift = Object.assign({
            name: value
        }, this.paginationCfgGift);

        this.setState({
            currentGift: 1
        });

        this.props.action.getGift(this.postDataGift);
    }

    handleRefreshGift() {
        this.paginationCfgGift.offset = 0;

        this.setState({
            currentGift: 1
        });

        this.props.action.getGift(this.paginationCfgGift).then(data => {
            const { code, msg } = data.value;

            if (code == 10000) {
                message.success('刷新成功！')
            } else {
                message.error(msg)
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.fetchLock) {
            return;
        }

        const { task } = this.props.state;

        this.props.form.validateFields((errors, values) => {
            const editorTxt = this.editor.$txt.text();
            const editorHtml = this.editor.$txt.html();

            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            if (!task.currentTask.task_item_list || task.currentTask.task_item_list.length == 0 ) {
                message.error('请至少选择一件商品！');
                return;
            }

            if (editorTxt.length != 0) {
                if (editorTxt.length > 200) {
                    message.error('任务说明不能多于200个字！');
                    return;
                } else {
                    values.content = editorHtml;
                }
            }

            values.start_time = values.time[0].format('YYYY-MM-DD HH:mm:ss');
            values.end_time = values.time[1].format('YYYY-MM-DD HH:mm:ss');
            values.type = task.type;
            values.task_item_list = JSON.stringify(task.currentTask.task_item_list);
            delete values.time;

            if (task.type == '2') {
                values.wechat_open_id = task.authorizeInfo.id;
            } else {
                values.share_url = task.shareInfo.share_url;
                values.count = task.shareInfo.count;
            }

            this.fetchLock = true;

            if (this.isEdit) {
                values.id = this.id;
                this.props.action.updateTask(values).then(() => {
                    this.fetchLock = false;
                });
            } else {
                this.props.action.addTask(values).then(() => {
                    this.fetchLock = false;
                });
            }
        });
    }

    handleGoodsItemCancel(index) {
        const { selectedArr } = this.state;
        selectedArr.splice(index, 1);

        this.props.action.updateTaskItemList(selectedArr);
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.disabled = this.props.params.disabled;

        this.id ? this.isEdit = true : this.isEdit = false;
        this.disabled ? this.isDisabled = true : this.isDisabled = false;

        if (this.isEdit) {
            this.props.action.getCurrentTask({
                id: this.id
            }).then((data) => {
                const { code, msg } = data.value;

                if (code == 10000) {
                    if (data.value.data.content) {
                        this.editor.$txt.html(data.value.data.content);
                    }
                } else {
                    message.error(msg)
                }
            });
        }

        // 富文本编辑器插件
        var editorContainer = document.getElementById('editor');
        this.editor = new wangEditor(editorContainer);
        this.editor.config.menus = [
            'source',
            '|',
            'fontsize',
            'bold',
            'underline',
            'italic',
            'forecolor',
            '|',
            'alignleft',
            'aligncenter',
            'alignright'
        ];
        this.editor.create();
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
        const { task } = nextProps.state;

        if (task.status == 'success') {
            message.success(task.msg);
            browserHistory.push('/task/list')
        } else if (task.status == 'fail') {
            message.error(task.msg);
        }
    }

    render() {
        const self = this;
        const { task } = this.props.state;
        const { goods } = this.props.state.goods;
        const { gift } = this.props.state.gift;
        const { currentTask } = this.props.state.task;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        let taskItemList = [];
        if (currentTask.task_item_list) {
            taskItemList = _.map(currentTask.task_item_list, (item, index) => {
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

        const paginationGoods = {
            current: this.state.currentGoods,
            total: goods.total_count,
            onChange(page) {
                self.paginationCfgGoods.offset = (page - 1) * self.paginationCfgGoods.count;
                self.postDataGoods = Object.assign(self.postDataGoods, self.paginationCfgGoods);

                self.setState({
                    currentGoods: page,
                });

                self.props.action.getGoods(self.postDataGoods);
            }
        }

        const columnsGift = [{
            title: '标题',
            dataIndex: 'name',
            key: 'name',
            width: '30%'
        }, {
            title: '创建时间',
            dataIndex: 'gmt_created',
            key: 'gmt_created',
            width: '30%'
        }, {
            title: '商品数',
            dataIndex: 'item_count',
            key: 'item_count',
            width: '30%'
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operate',
            width: '10%',
            render(text, record) {
                return (
                    <Button type="default" size="small" onClick={() => self.giftItemClick(record)}>选择</Button>
                )
            }
        }]

        const paginationGift = {
            current: this.state.currentGift,
            total: goods.total_count,
            onChange(page) {
                self.paginationCfgGift.offset = (page - 1) * self.paginationCfgGift.count;
                self.postDataGift = Object.assign(self.postDataGift, self.paginationCfgGift);

                self.setState({
                    currentGift: page,
                });

                self.props.action.getGift(self.postDataGift);
            }
        }

        if (task.type == 2) {
            var elem = <div>
                <FormItem {...formItemLayout} label="任务类型">
                    <p className="ant-form-text">关注公众号</p>
                    {this.isEdit ? '' : <Button type="primary" size="small"><Link to='/task/new'>返回上一步修改</Link></Button>}
                </FormItem>
                <FormItem {...formItemLayout} label="当前授权">
                    <p className="ant-form-text">{task.authorizeInfo && task.authorizeInfo.nick_name}</p>
                </FormItem>
            </div>
        } else {
            var elem = <div>
                <FormItem {...formItemLayout} label="任务类型">
                    <p className="ant-form-text">分享链接</p>
                    {this.isEdit ? '' : <Button type="primary" size="small"><Link to='/task/new'>返回上一步修改</Link></Button>}
                </FormItem>
                <FormItem {...formItemLayout} label="分享人数">
                    {getFieldDecorator('count', {
                        initialValue: task.shareInfo && task.shareInfo.count.toString(),
                        rules: [
                            { required: true, message: '分享人数不能为空' }
                        ]
                    })(
                        this.isEdit ? <Input placeholder="请输入人数" disabled /> : <Input placeholder="请输入人数" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="分享链接">
                    {getFieldDecorator('share_url', {
                        initialValue: task.shareInfo.share_url,
                        rules: [
                            { required: true, message: '分享人数不能为空' }
                        ]
                    })(
                        this.isEdit ? <Input placeholder="请输入链接" disabled /> : <Input placeholder="请输入链接" />
                    )}
                </FormItem>
            </div>
        }

        var defaultTime = []
        if (currentTask.start_time && currentTask.start_time) {
            defaultTime = [moment(currentTask.start_time), moment(currentTask.end_time)];
        } else {
            var date1 = new Date();
            var date2 = new Date(date1);
            date2.setDate(date1.getDate() + 7);

            defaultTime = [moment(date1), moment(date2)]
        }

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    {elem}
                    <FormItem {...formItemLayout} label="活动名称">
                        {getFieldDecorator('title', {
                            initialValue: currentTask.title,
                            rules: [
                                { required: true, message: '活动名称不能为空' },
                                { max: 20, message: '活动名称不能超过20个字' }
                            ]
                        })(
                            <Input placeholder="请输入活动名称" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="有效期">
                        {getFieldDecorator('time', {
                            initialValue: defaultTime,
                            rules: [
                                { required: true, type: 'array', message: '有效期不能为空' }
                            ]
                        })(
                            <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="赠送商品">
                        <Button type="primary" size="small" onClick={this.showModal.bind(this)}>选择商品</Button>
                        <p className="ant-form-text">最多选择10件商品</p>
                        <div>
                            {taskItemList}
                        </div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="任务说明">
                        <div id="editor" style={{height: '150px'}}></div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="参与次数">
                        {getFieldDecorator('user_limit', {
                            initialValue: currentTask.user_limit && currentTask.user_limit.toString(),
                            rules: [
                                { required: true, message: '参与次数不能为空' },
                                { pattern: /^[1-9]\d*$/, message: '参与次数请填写数字' }
                            ]
                        })(
                            <Input placeholder="每个用户限参与的次数" />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                        { this.isDisabled ? <Button type="primary" htmlType="submit" size="default" disabled>确定</Button> : <Button type="primary" htmlType="submit" size="default">确定</Button> }
                    </FormItem>
                </Form>
                <Modal
                    title="选择商品"
                    visible={this.state.visible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="ok" type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
                    ]}
                    width={700}
                >
                    <Tabs defaultActiveKey="1" size="small">
                        <TabPane tab="全部商品" key="1">
                            <div className="ui-box">
                                <Row>
                                    <Col span={12}>
                                        <Button type="primary"><Link target="_blank" to="/goods/detail">添加</Link></Button>&nbsp;
                                        <Button type="primary" onClick={this.handleRefreshGoods.bind(this)}>刷新</Button>
                                    </Col>
                                    <Col span={12}>
                                        <SearchInput
                                            placeholder="请输入商品名称"
                                            onSearch={value => this.handleSearchGoods(value)}
                                            style={{
                                                width: 200,
                                                float: 'right'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Table columns={columnsGoods} dataSource={goods.item_list} pagination={paginationGoods} size="middle" />
                            </div>
                        </TabPane>
                        <TabPane tab="全部赠品" key="2">
                            <div className="ui-box">
                                <Row>
                                    <Col span={12}>
                                        <Button type="primary"><Link target="_blank" to="/gift/detail">添加</Link></Button>&nbsp;
                                        <Button type="primary" onClick={this.handleRefreshGift.bind(this)}>刷新</Button>
                                    </Col>
                                    <Col span={12}>
                                        <SearchInput
                                            placeholder="请输入赠品库名称"
                                            onSearch={value => this.handleSearchGift(value)}
                                            style={{
                                                width: 200,
                                                float: 'right'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Table columns={columnsGift} dataSource={gift.gift_group_list} pagination={paginationGift} size="middle" />
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

TaskDetail = Form.create()(TaskDetail)

export default TaskDetail;
