import {useNotify} from "src/composables/useNotify";
import {useLoadingBox} from "src/composables/useLoadingBox";



export const useUpload = () => {
  const {
    loadingHide,
    loadingShow
  } = useLoadingBox()

  const added = (files) => {
    if (files.length > 1) {

    }
  }

  // 上传中
  const uploading = (info) => {
    loadingShow('头像上传中')
  }

  // 上传完成
  const uploaded = (file) => {
    loadingHide()
    useNotify().infoNotify("上传成功")
  }

  const onRejected = (rejectedEntries) => {
    useNotify().warningNotify(`${rejectedEntries.length} file(s) did not pass validation constraints`)
  }

  const factoryFailed = (info) => {
  }

  const finish = () => {
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
