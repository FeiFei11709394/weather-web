import axios from 'axios'
import router from '../router'
import {Message} from 'element-ui';
axios.defaults.baseURL = 'http://127.0.0.1:5000';

// 处理请求 添加token
axios.interceptors.request.use(function (config) {
    const value = localStorage.getItem("token");
    config.headers['Authorization'] = value ? "JWT " + value : "";
    return config;
}, function (error) {
    return Promise.reject(error);
});


// 处理响应
axios.interceptors.response.use(function (response) {
    return response
    },
    function (error) {
    try {
        if (error.response.status === 401) {
            // 暂无处理 应重新跳转到登录 进行登录
            Message.info({
                message: '请刷新页面',
                duration: 1000
            });
        }

        if (error.response.status === 500) {
                Message.error({
                    message: '服务器内部异常, 请检查',
                    duration: 1000
                });
        }

    }
    catch (e) {
        Message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
        })
    }
});
// 登录
export const login = params => {
    return axios.post('/user/login/', params).then(res => res.data)
};

// 查询天气
export const weather = params => {
    return axios.get('/weather/', params).then(res => res.data)
};