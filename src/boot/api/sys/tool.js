import {axiosInstance} from '@/boot/api/request'

const prefix = "/sysTool"


/**
 * 通过Id发布通知
 *   GET /sysTool/notify/publish/{notifyId}
 *   接口ID：114445400
 *   接口地址：https://app.apifox.com/link/project/2914493/apis/api-114445400
 * @param param
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const notifyPublishById = (param)=>{
    try {
        return axiosInstance.get(`${prefix}/notify/publish/${param}`)
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }

}

/**
 * 通过一个或者多个id删除字典子项
 *   DELETE /sysTool/dict/item
 *   接口ID：114445405
 *   接口地址：https://app.apifox.com/link/project/2914493/apis/api-114445405
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const delDictItem = (data) => {
    try {
        return axiosInstance.delete(`${prefix}/dict/item`, {
            data: data
        })
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }

}

/**
 * 添加或修改字典子项
 *  POST /sysTool/dict/item
 *  接口ID：114445406
 *  接口地址：https://app.apifox.com/link/project/2914493/apis/api-114445406
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addDictItem = (data) => {
    try {
        return axiosInstance.post(`${prefix}/dict/item`, data)
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }

}


/**
 *  通过字典类型查询字典项信息
 *  GET /sysTool/dict/item/{dictType}
 *  接口ID：114445407
 *  接口地址：https://app.apifox.com/link/project/2914493/apis/api-114445407
 * @param param
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getDictItem = (param) => {
    try {
        return axiosInstance.get(`${prefix}/dict/item/${param}`)
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }

}

/**
 * 通过字典类型 查询字典子项分页列表
 *
 * @param param
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getDictItemList = (param) => {
    try {
        return axiosInstance.get(`${prefix}/dict/item`, {
            params: param
        })
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }

}

/**
 * 查询字典列表
 *   GET /sysTool/dict/list
 *   接口ID：109417385
 *   接口地址：https://app.apifox.com/link/project/2914493/apis/api-109417385
 * @param param
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getDictList = (param) => {
    try {
        return axiosInstance.get(`${prefix}/dict/list`, {
            params: param
        })
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }
}

/**
 * 添加或者修改通知信息
 *   POST /sysTool/notify
 *   接口ID：114445401
 *   接口地址：https://app.apifox.com/link/project/2914493/apis/api-114445401
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addOrUpdateNotify = (data) => {
    try {
        return axiosInstance.post(`${prefix}/notify`,data)
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }
}


