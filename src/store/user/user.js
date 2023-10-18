import Cookie from "@/boot/cookie";
import {axiosInstance} from '@/boot/api/request'
import {useNotify} from "@/boot/useNotify";
import {LocalStorage} from "quasar";

export default {
    state: {
        userinfo: undefined,
        token: undefined,
        menulist: undefined,
        dictTypeList: undefined,
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
        },
        getDictTypeList() {
            return Cookie.getLocalValue(Cookie.DICTTYPELIST)
        }
    },
    // this.$store.commit('user/setToken',"sdkfja;skdjfl;ajd")
    mutations: {
        setDictType(s, v) {
            LocalStorage.set(Cookie.DICTTYPELIST, v);
            s.dictTypeList = Cookie.getCookies(Cookie.DICTTYPELIST)
        },
        setToken(s, v) {
            Cookie.setCookies(Cookie.TOKENNAME, v)
            s.token = Cookie.getCookies(Cookie.TOKENNAME)
        },
        loginExit(s, v) {
            Cookie.clear()
            Cookie.LocalClear()
            // Cookie.removeCookies(Cookie.TOKENNAME)
            // Cookie.removeCookies(Cookie.USERINFO)
            // Cookie.removeLocalKey(Cookie.MENULIST)
        }
    },
    // this.$store.dispatch('user/setTokenActions',"123123123")
    actions: {
        setTokenActions({commit}, v) {
            commit("setToken", v);
        },
        // 登录操作
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