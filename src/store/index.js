import {createStore, createLogger} from 'vuex'
import user from './modules/user.js'
import menuRoutes from './modules/menuRoutes.js'
import sysConfig from "./modules/sysConfig.js";

// const debug = process.env !== 'sdfsadfsdf'

export default createStore({
  modules: {
    menuRoutes,
    sysConfig,
    user,
  },
  // plugins: debug ? [createLogger()] : []
})

