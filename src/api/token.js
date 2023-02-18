/**
 *
 *  token 接口
 * */
import {api} from "../boot/axios.js"

export const create = (username, password) => {
  return api.post("/tokens/", {username, password})
}
