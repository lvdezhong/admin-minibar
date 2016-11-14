import React from 'react'
import { browserHistory } from 'react-router'
import { Form, Input, Button, Row, Col, notification } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import action from '../../store/actions'

import './index.less'

const FormItem = Form.Item

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Login extends React.Component {
    constructor() {
        super()
    }

    handleSubmit(e) {
        e.preventDefault()

        const data = this.props.form.getFieldsValue()

        this.props.action.login({
            mobile: data.user,
            password: data.password
        }).then(function(data) {
            const { code, msg } = data.value;

            if (code == 10000) {
                const { access_token, user } = data.value.data;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('uid', user.id);
                localStorage.setItem('mobile', user.mobile);

                notification.success({
                    message: '登录成功',
                    description: 'Welcome ' + user.mobile
                });

                browserHistory.push('/device/list');
            } else {
                notification.error({
                    message: '登录失败',
                    description: msg
                });
            }
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }

        const { getFieldDecorator } = this.props.form

        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                <Form horizontal onSubmit={this.handleSubmit.bind(this)} className="login-form">
                    <FormItem label='用户名：' {...formItemLayout}>
                        {getFieldDecorator('user')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='密码：' {...formItemLayout}>
                        {getFieldDecorator('password')(
                            <Input type='password' />
                        )}
                    </FormItem>
                    <Row>
                        <Col span='16' offset='6'>
                            <Button type='primary' htmlType='submit'>确定</Button>
                        </Col>
                    </Row>
                </Form>
                </Col>
            </Row>
        )
    }
}

Login = Form.create()(Login);

export default Login;
