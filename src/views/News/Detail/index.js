import React, { PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button, Upload, Icon, message, Row, Col } from 'antd'

import action from '../../../store/actions'

import 'wangeditor/dist/css/wangEditor.min.css'
import 'wangeditor'

import './index.less'

const FormItem = Form.Item;

@connect(
    state => ({state: state}),
    dispatch => ({action: bindActionCreators(action, dispatch)})
)

class newsDetail extends React.Component {
    constructor(props) {
        super()
        this.state = {}
        this.hotel_id = props.state.hotel.currentHotel;
    }

    componentDidMount() {
        this.id = this.props.params.id;
        this.id ? this.isEdit = true : this.isEdit = false;

        if (this.isEdit) {
            this.props.action.getCurrentNews({
                id: this.id
            }).then((data) => {
                this.editor.$txt.html(data.value.data.content);
            });
        } else {
            this.props.action.getEmptyNews();
        }

        // 富文本编辑器插件
        var editorContainer = document.getElementById('editor');
        this.editor = new wangEditor(editorContainer);
        this.editor.config.menus = [
            'source',
            '|',
            'fontsize',
            'bold',
            'italic',
            'forecolor',
            '|',
            'alignleft',
            'aligncenter',
            'alignright',
            '|',
            'img'
        ];
        this.editor.config.menuFixed = false;
        // 图片上传部分
        this.editor.config.uploadImgUrl = 'http://media.mockuai.com/upload.php';
        this.editor.config.uploadImgFileName = 'file';
        this.editor.config.uploadParams = {
            user_id: 2088575
        }
        this.editor.config.uploadImgFns.onload = resultText => {
            let { url } = JSON.parse(resultText).data;
            let originalName = this.editor.uploadImgOriginalName || '';

            this.editor.command(null, 'insertHtml', '<img src="' + url + '" alt="' + originalName + '" style="max-width:100%;"/>');
        }

        this.editor.create();
    }

    componentWillReceiveProps(nextProps) {
        const { news } = nextProps.state;

        if (nextProps.state.news.currentNews != this.props.state.news.currentNews) {
            this.setState({
                frontImg: news.currentNews.front_image_url,
                shareImg: news.currentNews.share_image_url
            });
        }
    }

    handleFrontChange(info) {
        let file = info.file;

        if (file.status === 'done') {
            message.success(`${file.name} 上传成功！`);
        } else if (file.status === 'error') {
            message.error(`${file.name} 上传失败！`);
        }

        if (file.response && file.response.code == 10000) {
            file.url = file.response.data.url;

            this.setState({
                frontImg: file.url
            });

            this.props.form.setFieldsValue({
                front_image_url: file.url
            });
        }
    }

    handleShareChange(info) {
        let file = info.file;

        if (file.status === 'done') {
            message.success(`${file.name} 上传成功！`);
        } else if (file.status === 'error') {
            message.error(`${file.name} 上传失败！`);
        }

        if (file.response && file.response.code == 10000) {
            file.url = file.response.data.url;

            this.setState({
                shareImg: file.url
            });

            this.props.form.setFieldsValue({
                share_image_url: file.url
            });
        }
    }

    handleStartUpload() {
        message.warning('上传中...');
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            const editorTxt = this.editor.$txt.text();
            const editorImgs = this.editor.$txt.find('img');
            const editorHtml = this.editor.$txt.html();

            if (errors) {
                message.error('请正确填写表单！');
                return;
            }

            if (editorTxt == '' && editorImgs.length == 0) {
                message.error('请填写活动内容！');
                return;
            }

            values.content = editorHtml;

            if (this.isEdit) {
                values.id = this.id;
                this.props.action.updateNews(values).then(() => {
                    message.success('修改成功');
                    browserHistory.push('/news/list');
                }).catch(data => {
                    message.error(data.msg);
                });
            } else {
                values.hotel_id = this.hotel_id;
                this.props.action.addNews(values).then(() => {
                    message.success('添加成功');
                    browserHistory.push('/news/list');
                }).catch(data => {
                    message.error(data.msg);
                });
            }
        });
    }

    render() {
        const { currentNews } = this.props.state.news;
        const { frontImg, shareImg } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        const { getFieldDecorator } = this.props.form;

        const front_props_upload = {
            action: 'http://media.mockuai.com/upload.php',
            data: {
                user_id: 2088575
            },
            headers:{
                "X-Requested-With": null
            },
            accept: ".jpg,.png",
            showUploadList: false,
            onChange: this.handleFrontChange.bind(this),
            beforeUpload: this.handleStartUpload.bind(this)
        }

        const share_props_upload = {
            action: 'http://media.mockuai.com/upload.php',
            data: {
                user_id: 2088575
            },
            headers:{
                "X-Requested-With": null
            },
            accept: ".jpg,.png",
            showUploadList: false,
            onChange: this.handleShareChange.bind(this),
            beforeUpload: this.handleStartUpload.bind(this)
        }

        return (
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
                <FormItem {...formItemLayout} label="封面">
                    {getFieldDecorator('front_image_url', {
                        initialValue: currentNews.front_image_url,
                        rules: [
                            { required: true, message: '封面图片不能为空' }
                        ]
                    })(
                        <Input style={{display: 'none'}}/>
                    )}
                    <Upload className="frontimg-uploader" {...front_props_upload}>
                        {
                            frontImg ?
                            <img src={frontImg} className="frontimg" /> :
                            <Icon type="plus" className="frontimg-uploader-trigger" />
                        }
                    </Upload>
                </FormItem>
                <FormItem {...formItemLayout} label="标题">
                    {getFieldDecorator('title', {
                        initialValue: currentNews.title,
                        rules: [
                            { required: true, message: '标题不能为空' },
                            { max: 20, message: '标题不能超过20个字' }
                        ]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="活动内容">
                    <div id="editor" style={{height: '150px'}}></div>
                </FormItem>
                <FormItem {...formItemLayout} label="链接">
                    {getFieldDecorator('origin_url', {
                        initialValue: currentNews.origin_url,
                        rules: [
                            { required: true, message: '链接不能为空' },
                            { pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/, message: '链接格式不正确' }
                        ]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="分享图片">
                    {getFieldDecorator('share_image_url', {
                        initialValue: currentNews.share_image_url,
                        rules: [
                            { required: true, message: '分享图片不能为空' }
                        ]
                    })(
                        <Input style={{display: 'none'}}/>
                    )}
                    <Upload className="shareimg-uploader" {...share_props_upload}>
                        {
                            shareImg ?
                            <img src={shareImg} className="shareimg" /> :
                            <Icon type="plus" className="shareimg-uploader-trigger" />
                        }
                    </Upload>
                </FormItem>
                <FormItem {...formItemLayout} label="分享标题">
                    {getFieldDecorator('share_title', {
                        initialValue: currentNews.share_title,
                        rules: [
                            { required: true, message: '分享标题不能为空' }
                        ]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="分享内容">
                    {getFieldDecorator('share_content', {
                        initialValue: currentNews.share_content,
                        rules: [
                            { required: true, message: '分享内容不能为空' }
                        ]
                    })(
                        <Input type="textarea" rows={4} />
                    )}
                </FormItem>
                <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                    <Button type="primary" htmlType="submit" size="default">确定</Button>
                </FormItem>
            </Form>
        )
    }
}

newsDetail = Form.create()(newsDetail)

export default newsDetail;
