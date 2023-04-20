import {api} from "boot/axios"

const baseURL = import.meta.env.VITE_BASEURL
export const uploadOssUrl = `${baseURL}/upload/oss/image`;
export const uploadLocalUrl = `${baseURL}/upload/local/image`;

export const multipleUploadLocalUrl = `${baseURL}/upload/multiple/local/image`;
export const multipleUploadOssUrl = `${baseURL}/upload/multiple/oss/image`;


export const uploadLocal = (fileData) => {
  return api.post(multipleUploadOssUrl, fileData,{
    headers:{
      "Content-Type":"multipart/form-data"
    }
  })
}

/**
 *
 * transformRequest:[function (data, headers){
 *       delete headers.post['Content-Type']
 *       return data
 *     }]
 * */
