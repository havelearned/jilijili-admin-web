import {axiosInstance} from "@/boot/api/request"

const prefix = "/sysMenu"
export default {

    /**
     *
     * @param body
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    bindingMenuAndRole(body){
        try {
            return axiosInstance.post(`${prefix}/bindingRole`,body);
        } catch (error) {
            throw error; // 抛出错误以便上层可以处理
        }
    },
    /**
     *
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    getMenuList() {
        try {
            return axiosInstance.get(`${prefix}/list`);
        } catch (error) {
            throw error; // 抛出错误以便上层可以处理
        }
    },
    /**
     *
     * @param roleId
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    getRoleMenuList(roleId) {
        try {
            return axiosInstance.get(`${prefix}/getRoleMenuList/${roleId}`);
        } catch (error) {
            throw error; // 抛出错误以便上层可以处理
        }
    }
}