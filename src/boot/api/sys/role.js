import {axiosInstance} from '@/boot/api/request'

const prefix = "/sysUser"
export default {

    /**
     * 批量删除角色
     * @param roleIds 必须是一个数组
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    deleteRole(roleIds) {
        try {
            return axiosInstance.delete(`${prefix}/role`, {
                data: roleIds

            })

        } catch (e) {
            throw e; // 抛出错误以便上层可以处理
        }

    }
}