import {axiosInstance} from '@/boot/api/request'

const prefix = "/file"
export default {

    /**
     * 文件下载
     * @param filePath 要下载的文件
     * @param expiry 过期时间
     * @returns {Promise<axios.AxiosResponse<any>>} url
     */
    downloadFile(filePath, expiry) {
        try {
            return axiosInstance.get(`${prefix}/download`,{
                params:{"filePath":filePath,"expiry":expiry}
            })
        } catch (e) {
            throw e; // 抛出错误以便上层可以处理
        }
    },

    /**
     *
     * @param param 是一个数组,主要参数 param.filePath
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    delFile(param) {
        try {
            return axiosInstance.delete(`${prefix}/delFile`, {
                data: param
            })
        } catch (e) {
            throw e; // 抛出错误以便上层可以处理
        }
    },

    /**
     * @param param 是一个数组
     * @returns 添加目录
     */
    addFileDir(param) {
        try {
            return axiosInstance.post(`${prefix}/addFileDir`, param)
        } catch (e) {
            throw e; // 抛出错误以便上层可以处理
        }
    },

    /**
     * @returns 顶级目录
     */
    getTopLevelDir() {
        try {
            return axiosInstance.get(`${prefix}/getTopLevelDir`)
        } catch (e) {
            throw e; // 抛出错误以便上层可以处理
        }

    }
}