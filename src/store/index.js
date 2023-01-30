import {createStore, createLogger} from 'vuex'
import user from './modules/user.js'

// const debug = process.env !== 'sdfsadfsdf'

export default createStore({
  modules: {
    user
  },
  // plugins: debug ? [createLogger()] : []
})

