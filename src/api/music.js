import {api} from "boot/axios"

export const search = (queryParam) => {
  return api.get(`/music/list`,{
    params:queryParam
  })
}

export const add = (data) => {
  return api.post("/music/", data)
}
export const update = ( data) => {
  return api.put(`/music/`, data)
}

export const deleted = (id) => {
  return api.delete(`/music/${id}`)
}

export const musicInfo = (id) => {
  return api.get(`/music/${id}`)
}
