import {axiosIns} from '@/boot/api/reqGateway'

const prefix = "/shop"


/**
 * 添加商品分类
 * @param param 是一个对象
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addCategory = (param) => {
    try {
        return axiosIns.post(`${prefix}/products/categories`, param)
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }
}

/**
 * 获取商品分类列表
 * @param param 是一个对象
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCategoriesListDict = (param) => {
    try {
        return axiosIns.get(`${prefix}/products/categories/list/dict`, {
            params: param
        })
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }
}

