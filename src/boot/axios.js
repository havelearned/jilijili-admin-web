import {boot} from "quasar/wrappers"
import axios from "axios"
import store from "../store";
import {Loading, Notify} from "quasar"
import {whiteList} from "src/permission.js";

// const baseURL = import.meta.env.VITE_BASEURL_TENXUN
const baseURL = import.meta.env.VITE_BASEURL
// console.log("import", import.meta)
// console.log("import.url", import.meta.env.BASE_URL)
// console.log("import.env.MODE", import.meta.env.MODE)
// console.log("import.meta.env.VITE_BASEURL", import.meta.env.VITE_BASEURL)

const api = axios.create({
  baseURL: baseURL,
})

export const NeedLoginCode = [401, 402, 403];

const tokenPrefix = "Bearer ";

// 请求拦截器
api.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers["Authorization"] = tokenPrefix + store.state.user.token;
  }
  config.headers["Content-Type"] = "application/json"
  config.headers["Access-Control-Allow-Origin"] = "*"
  return config
}, error => {
  return Promise.reject(error)
})


// 响应拦截器
api.interceptors.response.use(response => {
  // 包含有白名单
  if (whiteList.indexOf(response.config.url) !== -1) {
    return response
  }
  return response.data
}, error => {
  Loading.hide()
  // 得到错误的相应信息
  let response = error.response
  if (response) {
    // 根据返回的状态码,做相应的逻辑处理
    switch (response.data.code) {
      case 401:
        store.dispatch("logout")
        break;
    }
  } else if (response !== undefined) {
    Notify.create({
      type: "negative", message: response.data.message, position: "top",
    })
  } else {
    handleErrorMessages(error);
  }
  return Promise.reject(error)

})


// 处理错误提示信息
function handleErrorMessages(error) {
  let msg = '';
  switch (error.message) {
    case "Network Error":
      msg += '网络错误,请检查是否链接到互联网!!!'
      break;
    case -1:
      msg += '连接失败';
      break;
    case 500:
      msg += '内部错误';
      break;
    case 404:
      msg += '页面不存在';
      break;
    case 401:
      msg += '登录超时，请重新登录';
      // goLogin();
      break;
    case 403:
      msg += '权限不足';
      break;
    default: {
      Notify.create({
        type: "negative", message: error.message, position: "top",
      })
    }
  }

  Notify.create({
    type: "negative", message: msg, position: "top",
  })
}


export default boot(({app, Vue}) => {
  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api

})

export {api}

