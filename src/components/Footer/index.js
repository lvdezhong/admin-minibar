import React from 'react'

import './index.less'

export default class Footer extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="ant-layout-footer">
                Copyright © 2015-2016 Mockuai.com All Rights Reserved. 杭州魔筷科技有限公司 版权所有
            </div>
        )
    }
}
