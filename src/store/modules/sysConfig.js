
// // 使用 store.state.user.xxx 调用
const state = () => ({
  // 暂存数据
  stagingData: {
    userList: { // 用户列表
      lastPage: 0, //上次选到了第几页缓存
    },
    layout:{
      isChat: true, // 默认开启聊天
      themeColor: "#000000", // 主题颜色
    }

  }
})

// 使用 store.getters['SysConfig/方法名称'] 调用
const getters = {};
// 使用 store.dispatch调用
const actions = {};
// 使用 store.commit调用
const mutations = {
  SET_STAGINGDATA_USERLIST_LASTPAGE: (state, page) => {
    state.stagingData.userList.lastPage = page;
  }

};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}

