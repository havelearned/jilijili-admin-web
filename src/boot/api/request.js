import axios from 'axios'
import { Notify } from 'quasar';

// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_URL);
const notify = (msg) => Notify.create({
    message: msg,
    color: 'negative',
});

export const goLogin = () => {
    window.location.replace('#/login');
};

export const NeedLoginCode = [401, 402, 403];

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:11110',
    // timeout: 3000,
    withCredentials:true, // 携带Cookie
})

axiosInstance.defaults.transformRequest.push((data, headers) => {
    // [0] 每次执行都会获取Cookie里面的token
    if (localStorage.Authorization) {
        headers.Authorization = localStorage.Authorization;
    }
    return data;
});

axiosInstance.interceptors.response.use(
    (r) => {
        if (r.data) {
            if (r.data.code && r.data.code !== 200) {
                if (r.data.message) {
                    notify(`${r.data.code} - ${r.data.message}`);
                }
                if (NeedLoginCode.some((v) => v === r.data.code)) {
                    goLogin();
                }
                return Promise.reject(r);
            }
            return r.data;
        }
        return r;
    },
    (error) => {
        let response = error.response
        let msg = '未知错误';
        if (error) {
            switch (error.code) {
                case 'Network Error':
                    msg = "服务器错误,请联系管理员!";
                    break;
                case "ECONNABORTED":
                    msg = "连接超时!";
                    break;
                case 'ERR_ADDRESS_UNREACHABLE':
                    msg = "网络错误,请检查网络设备是否连接正确!";
                    break;
                default:
                    msg = error.message
                    break;
            }
        }
        notify(msg);
        return Promise.reject(response);
    },
);





export const downFile = (url, data) => axiosInstance({
    url,
    method: 'GET',
    params: data,
    responseType: 'blob',
});

export const exportFile = (url, data) => axiosInstance({
    url,
    method: 'POST',
    data,
    responseType: 'blob',
});