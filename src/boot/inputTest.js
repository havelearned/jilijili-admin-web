export const requiredTest = (v) => !!v || '不可以为空';


export const dirRegEx = (v) => {
    let t = null;
    const p = /^[a-zA-Z0-9_-]+\/$/;
    if (v && !p.test(v)) {
        t = "包含字母、数字、下划线和短划线的目录名称，且必须以斜杠 \"/\" 结尾，不能包含空格"
    }
    return t;
}
export const usernameTest = (v) => {
    let t = null
    const p = /^.{6,16}$/
    if (v && !p.test(v)) {
        t = "长度在6-16之间的任意字符"
    }
    return t;
}

export const passwordTest = (v) => {
    let t = null
    const p = /^(?=[a-zA-Z0-9]{6,32}$)[a-zA-Z0-9]*$/
    if (v && !p.test(v)) {
        t = "长度最小为6最大32 必须字母或者数字"
    }
    return t;
}

export const emailTest = (v) => {
    let t = null;
    const p = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/;
    if (v && !p.test(v)) {
        t = '邮箱格式错误';
    }
    return t;
};

export const phoneTest = (v) => {
    let t = null;
    const p = /^1[3-9]\d{9}$/;
    if (v && !p.test(v)) {
        t = '手机号码格式错误';
    }
    return t;
};

export const numberTest = (v) => {
    let t = null;
    const p = /^-?\d*\.?\d+$/;
    if (v && !p.test(v)) {
        t = '必须为数字';
    }
    return t;
};

export const letterTest = (v) => {
    let t = null;
    const p = /^[a-zA-Z]*$/;
    if (v && !p.test(v)) {
        t = '必须为字母';
    }
    return t;
};

export const hcodeTest = (v) => {
    let t = null;
    const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (v && !p.test(v)) {
        t = '身份证号码格式错误';
    }
    return t;
};

export const confirmPassword = (pwd) => (v) => v === pwd || '两次密码输入不一致';
