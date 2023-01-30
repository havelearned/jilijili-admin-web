import {api} from "../boot/axios.js"

export const login = (username,password) => {
  return api.post("/login",{username,password});
}
