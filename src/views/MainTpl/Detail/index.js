import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Select, Button, message, Row, Col, Card } from 'antd'

import { getCurrentMainTpl, addMainTpl, updateMainTpl, getNewMainTpl } from '../../../actions/maintpl'

import Shelves from '../../../components/Shelves'

import './index.less'

const FormItem = Form.Item;

class MainTplDetail extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        const { getCurrentMainTpl, getNewMainTpl } = this.props;

        if (this.isEdit) {
            getCurrentMainTpl({
                id: this.id
            });
        } else {
            getNewMainTpl();
        }
    }

    handleClick(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            const { currentMainTpl, updateMainTpl, addMainTpl } = this.props;
            const tmplItemList = currentMainTpl.tmpl_item_list;

            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            if (this.isEdit) {
                updateMainTpl({
                    id: this.id,
                    name: values.name,
                    tmpl_item_list: JSON.stringify(tmplItemList)
                }).payload.promise.then(function(data) {
                    const { code, msg } = data.payload;

                    if (code == 10000) {
                        message.success('保存成功！');
                        browserHistory.push('/maintpl/list');
                    } else {
                        message.error(msg);
                    }
                });
            } else {
                addMainTpl({
                    name: values.name,
                    tmpl_item_list: JSON.stringify(tmplItemList)
                }).payload.promise.then(function(data) {
                    const { code, msg } = data.payload;

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
        const { currentMainTpl } = this.props;

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

function mapStateToProps(state) {
    const { currentMainTpl, isPending, errors } = state.maintpl;
    return {
        currentMainTpl: currentMainTpl,
        isPending: isPending,
        errors: errors
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCurrentMainTpl: bindActionCreators(getCurrentMainTpl, dispatch),
        addMainTpl: bindActionCreators(addMainTpl, dispatch),
        updateMainTpl: bindActionCreators(updateMainTpl, dispatch),
        getNewMainTpl: bindActionCreators(getNewMainTpl, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainTplDetail)
