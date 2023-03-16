import {api} from "boot/axios"

export const login = (username, password) => {
  return api.post("/login", {username, password});
}

export const search = (queryParam) => {
  return api.get(`/users/list`,{
    params:queryParam
  })
}

export const me = () => {
  return api.get("/users/me")
}

export const add = (data) => {
  return api.post("/users/", data)
}
export const update = ( data) => {
  return api.put(`/users/`, data)
}

export const deleted = (id) => {
  return api.delete(`/users/${id}`)
}

export const userinfo = (id) => {
  return api.get(`/users/${id}`)
}
