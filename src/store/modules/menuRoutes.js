const state = () => ({
    routes: [
      {title: "控制台", icon: "dashboard", path: "/dashboard", children: null},
      {
        title: "用户管理", icon: "manage_accounts", path: null, children: [
          {title: "用户列表", icon: "person", path: "/user/list", children: null},
          {title: "权限管理", icon: "people", path: "/user/operation", children: null},
        ]
      },
    ]
  }
)

const getters = {
  getMenuRoutes: state => {
    return state.routes
  }
}


const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
  },
  SET_MENUSROUTES: (state, routes) => {
    state.routes = routes
  }

}

const actions = {
  generateRoutes({commit}) {

  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions,
}
