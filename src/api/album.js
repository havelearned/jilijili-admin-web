/**
 * 专辑api
 * */

import {api} from "boot/axios"


export const list = (queryParam) => {
  return api.get(`/alibum/list`, {params: queryParam})
}


export const add = (data) => {
  return api.post("/alibum/", data)
}

export const update = (data) => {
  return api.put(`/alibum/`, data)
}

export const deleted = (id) => {
  return api.delete(`/alibum/?idList=${id}`)
}


export const alibumInfo = (id) => {
  return api.get(`/alibum/${id}`)
}

export const queryByAlibumId=(id)=>{
  return api.get(`/alibum/alibumId/${id}`)
}
