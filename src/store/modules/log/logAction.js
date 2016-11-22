import api from '../../../api'
import types from './logType'

export const getLog = (params) => ({
    type: types.GET_LOG,
    payload: api.post('/minibar/manager/log/list', {
        params
    })
})
