import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Select, Button, Upload, Icon, message, Row, Col } from 'antd'

import action from '../../../store/actions'

import Shelves from '../../../components/Shelves'

import { price } from '../../../utils'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class GoodsDetail extends React.Component {
    constructor() {
        super()
        this.state = {
            fileList_horizontal: [],
            fileList_vertical: []
        }

        this.fetchLock = false;
    }

    handleChangeHorizontal(info) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }

        let fileList = info.fileList;
        fileList = fileList.slice(-1);

        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.code === 10000;
            }
            return true;
        });

        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.data.url;
            }
            return file;
        });

        this.setState({ fileList_horizontal: fileList });
    }

    handleChangeVertical(info) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }

        let fileList = info.fileList;
        fileList = fileList.slice(-1);

        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.code === 10000;
            }
            return true;
        });

        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.data.url;
            }
            return file;
        });

        this.setState({ fileList_vertical: fileList });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.fetchLock) {
            return;
        }

        const { updateGoods, addGoods } = this.props;
        const { fileList_horizontal, fileList_vertical } = this.state;

        if (fileList_horizontal.length == 0) {
            message.error('请上传横图！');
            return
        }

        if (!fileList_horizontal[0].url) {
            message.warn('横图还未上传成功请稍候！');
            return
        }

        if (fileList_vertical.length == 0) {
            message.error('请上传竖图！');
            return
        }

        if (!fileList_vertical[0].url) {
            message.warn('竖图还未上传成功请稍候！');
            return
        }

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            this.fetchLock = true;

            if (this.isEdit) {
                this.props.action.updateGoods({
                    id: this.id,
                    name: values.name,
                    origin_price: price('POST', values.origin_price),
                    category_id: values.category_id,
                    image_horizontal: fileList_horizontal[0].url,
                    image_vertical: fileList_vertical[0].url
                }).then((data) => {
                    this.fetchLock = false;
                    const { code, msg } = data.value;

                    if (code == 10000) {
                        message.success('保存成功！');
                        browserHistory.push('/goods/list');
                    } else {
                        message.error(msg);
                    }
                });
            } else {
                this.props.action.addGoods({
                    name: values.name,
                    origin_price: price('POST', values.origin_price),
                    category_id: values.category_id,
                    image_horizontal: fileList_horizontal[0].url,
                    image_vertical: fileList_vertical[0].url
                }).then((data) => {
                    this.fetchLock = false;
                    const { code, msg } = data.value;

                    if (code == 10000) {
                        message.success('保存成功！');
                        browserHistory.push('/goods/list');
                    } else {
                        message.error(msg);
                    }
                });
            }
        });
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        const { getCurrentGoods, getCategory, getNewGoods, currentGoods } = this.props;

        if (this.isEdit) {
            this.props.action.getCurrentGoods({
                id: this.id
            }).then((data) => {
                const { code, msg } = data.value;

                if (code == 10000) {
                    console.log(data);
                    var { data } = data.value

                    this.setState({
                        fileList_horizontal: [{
                            uid: -1,
                            name: '',
                            status: 'done',
                            url: data.item.image_horizontal,
                        }],
                        fileList_vertical: [{
                            uid: -1,
                            name: '',
                            status: 'done',
                            url: data.item.image_vertical,
                        }]
                    })

                    this.props.form.setFieldsValue({
                        name: data.item.name,
                        origin_price: price('GET', data.item.origin_price)
                    });
                } else {
                    message.error(msg)
                }
            })
        } else {
            this.props.action.getNewGoods();
        }

        this.props.action.getCategory({
            offset: 0,
            count: 1000
        });
    }

    render() {
        const { currentGoods, category } = this.props.state.goods;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }

        const { getFieldDecorator } = this.props.form;

        let options = [];
        let defaultValue = currentGoods.category_id ? currentGoods.category_id.toString() : '';

        if (category.item_category_list) {
            options = category.item_category_list.map((item) => {
                return (
                    <Option key={item.id}>{item.name}</Option>
                )
            });
        }

        options.unshift(<Option key={0} value="">请选择类目</Option>);

        const props_horizontal = {
            action: 'http://media.mockuai.com/upload.php',
            data: {
                user_id: 2088575
            },
            headers: {
                "X-Requested-With": null
            },
            accept: ".jpg,.png",
            listType: 'picture',
            fileList: this.state.fileList_horizontal,
            onChange: this.handleChangeHorizontal.bind(this)
        }

        const props_vertical = {
            action: 'http://media.mockuai.com/upload.php',
            data: {
                user_id: 2088575
            },
            headers:{
                "X-Requested-With": null
            },
            accept: ".jpg,.png",
            listType: 'picture',
            fileList: this.state.fileList_vertical,
            onChange: this.handleChangeVertical.bind(this)
        }

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="商品主图">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Upload {...props_horizontal}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 横图
                                    </Button>
                                    <span className="help">建议尺寸：376px * 556px</span>
                                </Upload>
                            </Col>
                            <Col span={12}>
                                <Upload {...props_vertical}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> 竖图
                                    </Button>
                                    <span className="help">建议尺寸：182px * 556px</span>
                                </Upload>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem {...formItemLayout} label="商品名称">
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '商品名称不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="商品价格">
                        {getFieldDecorator('origin_price', {
                            rules: [
                                { required: true, message: '商品价格不能为空' },
                                { pattern: /^\d+(?:\.\d{1,2})?$/, message: '价格不能超过两位小数' }
                            ]
                        })(
                            <Input placeholder="元" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="商品类目">
                        {getFieldDecorator('category_id', {
                            initialValue: defaultValue ,
                            rules: [
                                { required: true, message: '请选择一个类目' }
                            ]
                        })(
                            <Select style={{ width: 120 }}>
                                {options}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                        <Button type="primary" htmlType="submit" size="default">确定</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

GoodsDetail = Form.create()(GoodsDetail)

export default GoodsDetail;
