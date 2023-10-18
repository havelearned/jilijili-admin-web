import {axiosIns} from '@/boot/api/reqGateway'

const prefix = "/shop"


/**
 * 通过id查询订单信息
 *   GET /orders/{orderId}
 *   接口ID：108073456
 *   接口地址：https://app.apifox.com/link/project/2914493/apis/api-108073456
 * @param param
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const queryOrderInfoById = (param) => {
    try {
        return axiosIns.get(`${prefix}/orders/${param}`)
    } catch (e) {
        throw e; // 抛出错误以便上层可以处理
    }
}



