import {useNotify} from "src/composables/useNotify";
import {useLoadingBox} from "src/composables/useLoadingBox";



export const useUpload = () => {
  const {
    loadingHide,
    loadingShow
  } = useLoadingBox()

  const added = (files) => {
    if (files.length > 1) {
      console.log("头像选择过多")
    }
    console.log("added==>", files)

  }

  // 上传中
  const uploading = (info) => {
    loadingShow('头像上传中')
    console.log("uploading====>", info)
  }

  // 上传完成
  const uploaded = (file) => {
    loadingHide()
    useNotify().infoNotify("上传成功")
    console.log("uploaded=====>", file.xhr.responseText)
  }

  const onRejected = (rejectedEntries) => {
    console.log("rejectedEntries====>", rejectedEntries)
    useNotify().warningNotify(`${rejectedEntries.length} file(s) did not pass validation constraints`)
  }

  const factoryFailed = (info) => {
    console.log("factoryFailed===>", info)
  }

  const finish = () => {
    console.log("finish===>")
  }


  return {
    added,
    uploaded,
    finish,
    uploading,
    factoryFailed,
    onRejected
  }
}
