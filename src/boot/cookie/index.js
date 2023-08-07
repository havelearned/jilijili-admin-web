import Cookies from "js-cookie";

const TOKENNAME = "jilijili-token";
const USERINFO = "userinfo";
const MENULIST = "menulist";
export default {
    TOKENNAME,
    USERINFO,
    MENULIST,

    /* Cookies */
    setCookies(key, value, isSetTimeOut = false, ex = 1) {
        if (!value) value = ''
        if (isSetTimeOut) {
            Cookies.set(key, JSON.stringify(value), {expires: ex})
        } else {
            // 写入cookie
            Cookies.set(key, JSON.stringify(value))
        }

    },
    getCookies(key, all = false) {
        if (all) {
            return Cookies.get()
        } else {
            let value = Cookies.get(key)
            if (value) {
                return JSON.parse(value) // => 'value'
            } else {
                return undefined
            }

        }
    },
    removeCookies(key) {
        Cookies.remove(key);
    },

    /*localStorage*/
    setLocalKeyValue(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    getLocalValue(key) {
        return JSON.parse(localStorage.getItem(key))
    },
    removeLocalKey(key){
        localStorage.removeItem(key)
    }
}

//
// // 读取
// Cookies.get('name') // => 'value'
// Cookies.get('nothing') // => undefined
// // 读取所有可见的cookie
// Cookies.get()
// // 删除某项cookie值
// Cookies.remove('name')
