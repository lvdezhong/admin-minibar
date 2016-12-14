import types from './chartType'
import { combineReducers } from 'redux'
import { price, gradientColor } from '../../../utils'

const initialState = {
    activityPart: {},
    activityLive: {},
    activityRatio: {},
    hotel: [],
    global: [],
    statis: [],
    trend: [],
    view: [],
    pay: [],
    amount: [],
    isPending: false,
    errors: null
}

const hotel = (state = initialState.hotel, action) => {
    switch (action.type) {
        case types.GET_HOTEL_SUCCESS:
            return action.payload.data.hotel_list;
        default:
            return state;
    }
}

const activityPart = (state = initialState.activityPart, action) => {
    switch (action.type) {
        case types.GET_ACTIVITY_PART_DATA_SUCCESS:
            let data = [];
            let hotel = [];
            let result = action.payload.data;
            let gradient = new gradientColor('#e82400', '#8ae800', result.num_rows / 2); 

            _.each(result.series, (item, index) => {
                data.push({
                    time: item
                });

                _.each(result.rows, (obj, i) => {
                    if (i < result.num_rows / 2) {
                        data[index]['hotel_' + i + '_people'] = obj.values[index];
                    } else {
                        data[index]['hotel_' + (i - (result.num_rows / 2)) + '_num'] = obj.values[index];
                    }
                });
            });

            _.each(result.rows, (item, index) => {
                if (index < result.num_rows / 2) {
                    hotel.push({
                        name: item.by_values[0],
                        color: gradient[index]
                    });
                }
            });

            return {
                data,
                hotel
            }
        default:
            return state;
    }
}

const activityLive = (state = initialState.activityLive, action) => {
    switch (action.type) {
        case types.GET_ACTIVITY_LIVE_DATA_SUCCESS:
            let data = [];
            let hotel = [];
            let result = action.payload.data;
            let gradient = new gradientColor('#e82400', '#8ae800', result.num_rows);

            _.each(result.series, (item, index) => {
                data.push({
                    time: item
                });

                _.each(result.rows, (obj, i) => {
                    data[index]['hotel_' + i + '_num'] = obj.values[index];
                });
            });

            _.each(result.rows, (item, index) => {
                hotel.push({
                    name: item.by_values[0],
                    color: gradient[index]
                });
            });

            return {
                data,
                hotel
            }
        default:
            return state;
    }
}

const activityRatio = (state = initialState.activityRatio, action) => {
    switch (action.type) {
        case types.GET_ACTIVITY_RATIO_DATA_SUCCESS:
            let data = [];
            let hotel = [];
            let result = action.payload.data;
            let gradient = new gradientColor('#e82400', '#8ae800', result.num_rows);

            _.each(result.series, (item, index) => {
                data.push({
                    time: item
                });

                _.each(result.rows, (obj, i) => {
                    data[index]['hotel_' + i + '_num'] = obj.values[index];
                });
            });

            _.each(result.rows, (item, index) => {
                hotel.push({
                    name: item.by_values[0],
                    color: gradient[index]
                });
            });

            return {
                data,
                hotel
            }
        default:
            return state;
    }
}

const global = (state = initialState.global, action) => {
    switch (action.type) {
        case types.GET_GLOBAL_DATA_SUCCESS:
            let globalData = [];
            let result = action.payload.data.rows;

            for (let i = 0; i < 4; i++) {
                globalData.push({
                    trade: result[2 * i].values[0],
                    order: result[2 * i + 1].values[0]
                });
            }

            return globalData;
        default:
            return state;
    }
}

const statis = (state = initialState.statis, action) => {
    switch (action.type) {
        case types.GET_STATIS_DATA_SUCCESS:
            let statisData = action.payload.data.rows;

            statisData = _.map(statisData, item => {
                return item.values[0];
            });

            return statisData;
        default:
            return state;
    }
}

const trend = (state = initialState.trend, action) => {
    switch (action.type) {
        case types.GET_TREND_DATA_SUCCESS:
            let trendData = [];
            let result = action.payload.data;

            _.each(result.series, (item, index) => {
                trendData.push({
                    time: item,
                    home: result.rows[0].values[index],
                    detail: result.rows[1].values[index],
                    pay: result.rows[2].values[index],
                    detailPercent: result.rows[3].values[index],
                    payPercent: result.rows[4].values[index],
                    globalPercent: result.rows[5].values[index],
                    price: Number(price('GET', result.rows[6].values[index]))
                });
            });

            return trendData;
        default:
            return state;
    }
}

const view = (state = initialState.view, action) => {
    switch (action.type) {
        case types.GET_GOODS_VIEW_DATA_SUCCESS:
            let viewData = action.payload.data.rows;

            viewData = _.map(viewData, item => ({
                goods: item.by_values[0],
                num: item.values[0]
            }));

            return viewData;
        default:
            return state;
    }
}

const pay = (state = initialState.pay, action) => {
    switch (action.type) {
        case types.GET_GOODS_PAY_DATA_SUCCESS:
            let payData = action.payload.data.rows;

            payData = _.map(payData, item => ({
                goods: item.by_values[0],
                num: item.values[0]
            }));

            return payData;
        default:
            return state;
    }
}

const amount = (state = initialState.amount, action) => {
    switch (action.type) {
        case types.GET_GOODS_AMOUNT_DATA_SUCCESS:
            let amountData = action.payload.data.rows;

            amountData = _.map(amountData, item => ({
                goods: item.by_values[0],
                num: Number(price('GET', item.values[0]))
            }));

            return amountData;
        default:
            return state;
    }
}

const isPending = (state = initialState.isPending, action) => {
    switch (action.type) {
        case types.GET_CHART_PENDING:
        case types.GET_HOTEL_PENDING:
        case types.GET_GLOBAL_DATA_PENDING:
        case types.GET_STATIS_DATA_PENDING:
        case types.GET_TREND_DATA_PENDING:
        case types.GET_GOODS_VIEW_DATA_PENDING:
        case types.GET_GOODS_PAY_DATA_PENDING:
        case types.GET_GOODS_AMOUNT_DATA_PENDING:
        case types.GET_ACTIVITY_PART_DATA_PENDING:
        case types.GET_ACTIVITY_LIVE_DATA_PENDING:
        case types.GET_ACTIVITY_RATIO_DATA_PENDING:
            return true;
        default:
            return false;
    }
}

const errors = (state = initialState.errors, action = {}) => {
    switch (action.type) {
        case types.GET_CHART_ERROR:
        case types.GET_HOTEL_ERROR:
        case types.GET_GLOBAL_DATA_ERROR:
        case types.GET_STATIS_DATA_ERROR:
        case types.GET_TREND_DATA_ERROR:
        case types.GET_GOODS_VIEW_DATA_ERROR:
        case types.GET_GOODS_PAY_DATA_ERROR:
        case types.GET_GOODS_AMOUNT_DATA_ERROR:
        case types.GET_ACTIVITY_PART_DATA_ERROR:
        case types.GET_ACTIVITY_LIVE_DATA_ERROR:
        case types.GET_ACTIVITY_RATIO_DATA_ERROR:
            return action.payload.msg;
        default:
            return null;
    }
}

const chartReducer = combineReducers({
    activityPart,
    activityLive,
    activityRatio,
    hotel,
    global,
    statis,
    trend,
    view,
    pay,
    amount,
    isPending,
    errors
});

export default chartReducer;
