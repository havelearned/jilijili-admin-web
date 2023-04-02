import {api} from "boot/axios"

export const singerInfo = (id) => {
  return api.get(`/singer/${id}`);
}


export const list = (queryParam) => {
  return api.get("/singer/list", {params: queryParam});
}

export const addSinger = (data) => {
  return api.get("/singer/", data);
}
export const updated = (data) => {
  return api.put("/singer/", data);
}


export const deleted = (ids) => {
  return api.delete(`/singer/?idList=${ids}`);
}
