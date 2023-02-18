import {boot} from 'quasar/wrappers'
import axios from 'axios'
import store from '../store';
import {Notify, Loading} from 'quasar'
import {whiteList} from "src/permission.js";

const baseURL = import.meta.env.VITE_BASEURL_TENXUN
// const baseURL = import.meta.env.VITE_BASEURL_DEV
// const baseURL = import.meta.env.VITE_BASEURL
// console.log('import', import.meta)
// console.log('import.url', import.meta.env.BASE_URL)
// console.log('import.env.MODE', import.meta.env.MODE)
// console.log('import.meta.env.VITE_BASEURL', import.meta.env.VITE_BASEURL)

const api = axios.create({baseURL: baseURL})
const tokenPrefix = "Bearer ";

// 请求拦截器
api.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers['Authorization'] = tokenPrefix + store.state.user.token;
  }
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

  handleErrorResponse(error.response)
  return Promise.reject(error)

})

const handleErrorResponse = (response) =>{
  Loading.hide()
  switch (response.status){
    case 401:
      store.dispatch('logout')
      break;
  }
  Notify.create({
    type: 'negative', message: response.data.message, position: "top",
  })
}


export default boot(({app}) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export {api}

