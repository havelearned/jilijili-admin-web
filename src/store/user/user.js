import Cookie from "@/boot/cookie";
import {axiosInstance} from '@/boot/api/request'
import {useNotify} from "@/boot/useNotify";

export default {
    state: {
        userinfo: undefined,
        token: undefined,
        menulist: undefined,
    },
    // this.$store.getters['user/getToken'];
    getters: {
        getToken(state) {
            return Cookie.getCookies(Cookie.TOKENNAME)
        },
        getUserInfo(state) {
            return Cookie.getCookies(Cookie.USERINFO)
        },
        getMenuList(state) {
            return Cookie.getLocalValue(Cookie.MENULIST)
        }
    },
    // this.$store.commit('user/setToken',"sdkfja;skdjfl;ajd")
    mutations: {
        setToken(s, v) {
            Cookie.setCookies(Cookie.TOKENNAME, v)
            s.token = Cookie.getCookies(Cookie.TOKENNAME)
        },
        loginExit(s, v) {
            Cookie.removeCookies(Cookie.TOKENNAME)
            Cookie.removeCookies(Cookie.USERINFO)
            Cookie.removeLocalKey(Cookie.MENULIST)
        }
    },
    // this.$store.dispatch('user/setTokenActions',"123123123")
    actions: {
        setTokenActions({commit}, v) {
            commit("setToken", v);
        },
        loginActions({commit}, v) {
            return new Promise((resolve, reject) => {
                axiosInstance.post("/sysUser/login", v).then(res => {
                    if (res.data) {
                        // 设置token
                        Cookie.setCookies(Cookie.TOKENNAME, res.data)
                        commit('setToken', res.data)

                    } else {
                        useNotify().negativeNotify(res.message)
                    }

                    resolve(res)
                }).catch(err => {
                    console.log(err)
                    reject(err)
                })
            })
        },
    },
    namespaced: true,
};