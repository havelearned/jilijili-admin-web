import {getToken, removeToken, setToken} from "src/utils/auth.js";
import {login} from "../../api/user.js"

// // 使用 store.state.user.xxx 调用
const state = () => ({
  nickname: 'music',
  token: getToken(),
  username: 'admin',
  roles: 'root'
})

// 使用 store.getters['user/nicknameFastWord'] 调用
const getters = {
  nicknameFastWord: state => {
    return state.nickname.slice(1)

  }
};
// 使用 store.dispatch调用
const actions = {
  login({commit}, {username, password}) {
    return new Promise((resolve, reject) => {
      login(username.trim(), password).then(response => {
        const authorization = response.headers['authorization'];
        commit('SET_TOKEN', authorization);
        setToken(authorization);
        resolve();
      }).catch(reason => {
        reject(reason);
      });
    });
  },
  logout({commit, state, dispatch}) {
    commit('SET_TOKEN', ''); // 设置用户toke为空
    commit('SET_ROLES', []); // 设置权限为空
    removeToken();//设置cookie里面的token为空
  }
};
// 使用 store.commit调用
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token

  },
  SET_NICKNAME: (state, nickname) => {
    state.token = nickname
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}

