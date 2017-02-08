import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Row, Col, Button, message, Switch } from 'antd'

import action from '../../store/actions'

import './index.less'

const FormItem = Form.Item;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Contact extends React.Component {
    constructor(props) {
        super()

        this.hotel_id = props.state.hotel.currentHotel;
    }

    componentDidMount() {
        this.props.action.getContactState({
            hotel_id: this.hotel_id,
            type: 1
        });
        this.props.action.getMobile({
            hotel_id: this.hotel_id
        });
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.contact.errors;
        const nextErrors = nextProps.state.contact.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleChange() {
        this.props.action.setContactState({
            hotel_id: this.hotel_id,
            type: 1
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            this.props.action.updateMobile({
                hotel_id: this.hotel_id,
                mobile: values.mobile
            }).then(() => {
                message.success('更新成功');
            });
        });
    }

    render() {
        const { mobile, contactState } = this.props.state.contact;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <div className="ui-box">
                    <div className="title-switch">
                        <Row>
                            <Col span={12}>
                                <h3>联系前台</h3>
                            </Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                                <Switch
                                    checked={contactState == 0 ? false : true}
                                    onChange={this.handleChange.bind(this)}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="ui-box">
                    <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem {...formItemLayout} label="前台电话">
                            {getFieldDecorator('mobile', {
                                initialValue: mobile,
                                rules: [
                                    { required: true, message: '电话号码不能为空' }
                                ]
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <div className="contact-footer">
                            <Button type="primary" htmlType="submit" size="large">保存</Button>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

Contact = Form.create()(Contact);

export default Contact;
