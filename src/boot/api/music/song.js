import {axiosInstance} from "@/boot/api/request"

const prefix = "/song"
export default {

    getTest() {
        try {
            return axiosInstance.get(`/test/01`);
        } catch (error) {
            throw error; // 抛出错误以便上层可以处理
        }
    }
}