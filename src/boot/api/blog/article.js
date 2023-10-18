import {axiosIns} from "@/boot/api/reqGateway"

const prefix = "/blog"
export default {

    getArticleById(Id) {
        try {
            return axiosIns.get(`${prefix}/article/${Id}`);
        } catch (error) {
            throw error; // 抛出错误以便上层可以处理
        }
    }
}