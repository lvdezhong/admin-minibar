import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Select, Form, Row, Col, Button, message } from 'antd'

import action from '../../store/actions'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class Hotel extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        this.props.action.getHotel({
            count: 500,
            offset: 0
        });
    }

    componentWillReceiveProps(nextProps) {
        const errors = this.props.state.hotel.errors;
        const nextErrors = nextProps.state.hotel.errors;

        if (errors != nextErrors && nextErrors != null) {
            message.error(nextErrors);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        let data = this.props.form.getFieldsValue();
        this.props.action.setHotel(Number(data.hotel));
        message.success('保存成功！');
    }

    render() {
        const { hotel } = this.props.state.hotel;
        const { getFieldDecorator } = this.props.form;

        let options = _.map(hotel.hotel_list, (item) => {
            return (
                <Option key={item.id}>{item.name}</Option>
            )
        });

        return (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <div className="ui-box hotel-title">
                            请先选择酒店
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <div className="ui-box hotel-select">
                            <FormItem>
                                {getFieldDecorator('hotel', { initialValue: '' })(
                                    <Select>
                                        {options}
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col>
                        <div className="hotel-footer">
                            <Button type="primary" htmlType="submit" size="large">保存</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        )
    }
}

Hotel = Form.create()(Hotel)

export default Hotel;
