import {boot} from 'quasar/wrappers'
import axios from 'axios'
import store from '../store';


const baseURL = import.meta.env.VITE_BASEURL
// console.log('import', import.meta)
// console.log('import.url', import.meta.env.BASE_URL)
// console.log('import.env.MODE', import.meta.env.MODE)
// console.log('import.meta.env.VITE_BASEURL', import.meta.env.VITE_BASEURL)
const api = axios.create({baseURL: baseURL})

// 请求拦截器
api.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers['Authorization'] = store.state.user.token;
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})
export default boot(({app}) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export {api}

