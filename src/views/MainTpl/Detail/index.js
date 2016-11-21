import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Select, Button, message, Row, Col, Card } from 'antd'

import action from '../../../store/actions'

import Shelves from '../../../components/Shelves'

import './index.less'

const FormItem = Form.Item;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class MainTplDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        if (this.isEdit) {
            this.props.action.getCurrentMainTpl({
                id: this.id
            });
        } else {
            this.props.action.getNewMainTpl();
        }
    }

    handleClick(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            const tmplItemList = this.props.state.maintpl.currentMainTpl.tmpl_item_list;

            if (errors) {
                message.error('请填写模板名称！');
                return;
            }

            for (let i = 0; i < tmplItemList.length; i++) {
                if (tmplItemList[i].isDefault == true) {
                    message.error('商品未添加完全！');
                    return
                }

                tmplItemList[i].extro_info && delete tmplItemList[i].extro_info;
            }

            if (this.isEdit) {
                this.props.action.updateMainTpl({
                    id: this.id,
                    name: values.name,
                    tmpl_item_list: JSON.stringify(tmplItemList)
                }).then(function(data) {
                    const { code, msg } = data.value;

                    if (code == 10000) {
                        message.success('保存成功！');
                        browserHistory.push('/maintpl/list');
                    } else {
                        message.error(msg);
                    }
                });
            } else {
                this.props.action.addMainTpl({
                    name: values.name,
                    tmpl_item_list: JSON.stringify(tmplItemList)
                }).then(function(data) {
                    const { code, msg } = data.value;

                    if (code == 10000) {
                        message.success('保存成功！');
                        browserHistory.push('/maintpl/list');
                    } else {
                        message.error(msg);
                    }
                });
            }
        })
    }

    render() {
        const { currentMainTpl } = this.props.state.maintpl;

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
        }

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Card title="设备商品" >
                    <FormItem {...formItemLayout} label="模板名称">
                        {getFieldDecorator('name', {
                            initialValue: currentMainTpl.name,
                            rules: [
                                { required: true, message: '模板名称不能为空' }
                            ]
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <Shelves keyword="maintpl" />
                    <div className="footer-btn">
                        <Button type="primary" size="large" onClick={this.handleClick.bind(this)}>保存</Button>
                    </div>
                </Card>
            </div>
        )
    }
}

MainTplDetail = Form.create()(MainTplDetail)

export default MainTplDetail;
