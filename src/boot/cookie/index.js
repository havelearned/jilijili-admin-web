import Cookies from "js-cookie";

const TOKENNAME = "jilijili-token"; // token
const USERINFO = "userinfo"; // 用户信息
const MENULIST = "menulist"; // 菜单信息
const MENUTAB = "menuTab" // 菜单选择框
const CHATHISTORY = "ChatHistory" // 聊天记录
const CHATTAPOPTION = "ChatTapOption" // 和其他用户聊天选项卡
const DICTTYPELIST = "dictTypeList" // 字典类型列表
const NOTICEMESSAGE = "noticemessage" // 系统消息列表
const BREADCRUMBSLISTEN= "breadcrumbslisten" // 面包屑缓存

export default {
    TOKENNAME,
    USERINFO,
    MENULIST,
    CHATHISTORY,
    CHATTAPOPTION,
    MENUTAB,
    DICTTYPELIST,
    NOTICEMESSAGE,
    BREADCRUMBSLISTEN,
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
    },
    clear(){
        Cookies.remove(TOKENNAME);
        Cookies.remove(USERINFO);
        Cookies.remove(MENULIST);
        Cookies.remove(MENUTAB);
        Cookies.remove(CHATHISTORY);
        Cookies.remove(CHATTAPOPTION);
        Cookies.remove(DICTTYPELIST);
        Cookies.remove(NOTICEMESSAGE);
        Cookies.remove(BREADCRUMBSLISTEN);
    },
    LocalClear(){
        localStorage.clear()
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
