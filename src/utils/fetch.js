import axios from 'axios';
import iView from 'iview';
import Qs from 'qs'

// 创建axios实例
const axiosInstance = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 30000,
    headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
    transformRequest: [(data) => Qs.stringify(data)]
});

// request拦截器
axiosInstance.interceptors.request.use(config => {
    return config;
}, error => {
    Promise.reject(error);
});

// response拦截器
axiosInstance.interceptors.response.use(response => {
    if(response.data.status !== 200 && response.data.status !== 201 && response.data.status) {
        iView.Message.error({
            content: response.data.message,
            duration: 3
        });
        return Promise.reject('error');
    }
    return Promise.resolve(response.data);
}, error => {
    iView.Message.error('网络错误，请稍后再试！');
    return Promise.reject(error);
});

export default axiosInstance;
