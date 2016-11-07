import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Button, Input, Select, Row, Col, message, Form } from 'antd'

import action from '../../../store/actions'

import { toQueryString, getQueryString } from '../../../utils'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class TaskNew extends React.Component {
    constructor() {
        super()
    }

    handleChange(value) {
        this.props.action.setTaskType(value)
    }

    handleGet() {
        this.props.action.getLoginUrl();
    }

    handleNext() {
        const { task } = this.props.state;

        if (task.type == 1) {
            if (!this.auth_code) {
                message.warning('请先对公众号进行授权！');
                return;
            }

            this.props.action.getAuthorizeInfo({
                auth_code: this.auth_code
            });

            browserHistory.push('/task/detail');
        } else {
            this.props.form.validateFields((errors, values) => {
                if (errors) {
                    message.error('请正确填写表单！');
                    return;
                }

                this.props.action.getShareInfo(values);

                browserHistory.push('/task/detail');
            })
        }
    }

    componentDidMount() {
        this.auth_code = getQueryString('auth_code');
    }

    componentWillReceiveProps(nextProps) {
        const { task } = nextProps.state;

        if (task.loginUrl) {
            const params = toQueryString({ redirect_uri: location.href });
            const url = `${task.loginUrl}&${params}`;

            window.open(url);
        }

        if (task.status == 'success') {
            message.success(task.msg);
        } else if (task.status == 'fail') {
            message.error(task.msg);
        }
    }

    render() {
        const { task } = this.props.state;
        const { getFieldDecorator } = this.props.form;

        if (task.type == 1) {
            var elem = <div className="ui-box task-focus">
                <p>用户扫码关注公众号后，完成任务条件，可获得免费送资格</p>
                <Button type="primary" onClick={this.handleGet.bind(this)}>公众号授权</Button>
            </div>
        } else {
            var elem = <div className="ui-box task-share">
                <Row gutter={16}>
                    <Col span={7}>
                        <FormItem>
                            {getFieldDecorator('count', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '人数不能为空！' }
                                ]
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={17}>
                        <p>人点击查看分享链接后，可获得免费送资格</p>
                    </Col>
                </Row>
                <FormItem>
                    {getFieldDecorator('share_url', {
                        initialValue: '',
                        rules: [
                            { required: true, message: '分享链接不能为空！' }
                        ]
                    })(
                        <Input placeholder="请输入需要分享的链接" />
                    )}
                </FormItem>
            </div>
        }

        return (
            <div>
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <div className="ui-box task-new-title">
                            请先选择任务类型
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <div className="ui-box task-new-select">
                            <Select defaultValue={task.type} onChange={this.handleChange.bind(this)}>
                                <Option value="1">关注公众号</Option>
                                <Option value="2">分享链接</Option>
                            </Select>
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={12}>
                        {elem}
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col>
                        <div className="task-new-footer">
                            <Button type="primary" size="large" onClick={this.handleNext.bind(this)}>下一步</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

TaskNew = Form.create()(TaskNew)

export default TaskNew;
